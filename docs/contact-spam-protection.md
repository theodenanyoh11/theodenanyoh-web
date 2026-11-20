# Contact form spam protection

The Contact page loads the Turnstile script and renders a Managed widget above Send. The client sends `turnstileToken` and an off-screen `honeypot` beside `submissionData`. Expired tokens clear the client token. Failed sends reset the widget and show the booking link from Site Settings.

The form builder collection checks public REST and GraphQL creates in `beforeValidate`, before persistence and the plugin's email hook. Authenticated admin users and Local API calls bypass this check. The two extra fields are virtual, so they support GraphQL inputs without database columns or stored tokens.

A filled honeypot aborts the operation. The collection's REST error hook converts that abort into a 201 acknowledgement without saving or emailing. Missing or invalid tokens produce a public spam-check error. Verification times out after ten seconds and fails closed. An unset secret only allows submissions in development, with a server warning; production refuses them.

## Environment setup

Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in Vercel Production, Preview, and Development. Production uses the real widget keys. Preview and Development use Cloudflare's published always-pass test keys from `.env.example`.

The Cloudflare widget is named `theodenanyoh.com`, allows `theodenanyoh.com` and `www.theodenanyoh.com`, uses Managed mode, and has no pre-clearance.

The Vercel rule named `Contact form submission rate limit` matches the path `/api/form-submissions` and method `POST`. It uses a fixed window of 600 seconds, permits 5 requests per IP, and denies requests above that limit. The rule was added to the existing configuration without modifying other rules.

Preview and Production share a database. Never submit the form on Preview. Use a local database for all submission checks.

## Local HTTP checks

Use the test keys in `.env.example` and confirm `DATABASE_URI` points to the throwaway `theodenanyoh_web_dev` database on localhost. Start `pnpm dev --port 3100`. Find the Contact form ID locally, then substitute it for `2` if needed.

Count rows before and after each request:

```sh
psql postgres://localhost:5432/theodenanyoh_web_dev -Atc 'select count(*) from form_submissions;'
```

Missing token, expected 400 and no new row:

```sh
curl -sS -w '\nHTTP %{http_code}\n' -H 'Content-Type: application/json' \
  -d '{"form":2,"submissionData":[{"field":"name","value":"Local HTTP check"}]}' \
  http://localhost:3100/api/form-submissions
```

Valid test token, expected 201 and one new row:

```sh
curl -sS -w '\nHTTP %{http_code}\n' -H 'Content-Type: application/json' \
  -d '{"form":2,"turnstileToken":"XXXX.DUMMY.TOKEN.XXXX","submissionData":[{"field":"name","value":"Local HTTP check"}]}' \
  http://localhost:3100/api/form-submissions
```

Repeat the token request with Cloudflare's published always-fail secret, `2x0000000000000000000000000000000AA`, set on the server. Expect 400 and no new row. Restore the always-pass secret afterward.

Filled honeypot, expected 201 and no new row:

```sh
curl -sS -w '\nHTTP %{http_code}\n' -H 'Content-Type: application/json' \
  -d '{"form":2,"honeypot":"bot","submissionData":[{"field":"name","value":"Local HTTP check"}]}' \
  http://localhost:3100/api/form-submissions
```

Run the standard checks:

```sh
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm start -p 3101
# In another terminal:
pnpm smoke http://localhost:3101
pnpm seed:redesign
```

In a browser at 390px and 1440px, submit locally with the test widget. Check that the widget appears and that each valid send shows Thank you. With the failing secret, check the error copy, booking link, and widget reset.

References: [Cloudflare server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Cloudflare test keys](https://developers.cloudflare.com/turnstile/troubleshooting/testing/), and [Vercel rate limits](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).
