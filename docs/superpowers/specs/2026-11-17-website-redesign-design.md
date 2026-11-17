# theodenanyoh.com redesign and upgrade: design

Date: 17 November 2026
Status: built. PR 10 (upgrade) and PR 11 (redesign) are open for review
Design source: Paper file "theodenanyoh.com · 2026 Redesign" (https://app.paper.design/file/01M7H13138PYHQJACRY12TTE9T)
Research: `docs/design/research/2026-11-15-homepage-redesign/report.md`

## Goal

Rebuild theodenanyoh.com so that an employer hiring a product leader can see, in under a minute, what Theo has shipped and how he works. Co-founders and clients are the second and third audiences. The same work brings the site onto supported, patched versions of Payload and Next.js.

## Decisions already made

| Topic | Decision |
|---|---|
| Lead audience | Employers at startups and small tech companies |
| Job signal | Quiet. The site never says "open to work" |
| Employer in hero | Not named. The hero says "product leader in HR software". Paycor appears in the logo strip and on Experience |
| Result figures | Not on the homepage. On Experience they appear softened: "eight-figure revenue impact", "a third fewer support contacts" |
| Layout | Editorial bento, pale tinted tiles, cobalt as the only loud colour |
| Brand | "Td." mark, cobalt #1F3BFF, Kente Gold #F5B700, Inter Tight for display, Inter for body |
| Payload | 3.93 now. Version 4 when it is stable |
| Video resume | Produce two versions and compare: a Synthesia avatar with Theo's own face and voice, and a self-recorded voiceover over product footage |
| Left off the site | buyHCM (anonymity), the Paychex support concept (employer branding), marsHedge real trading figures (sample data only) |
| Git | I commit, push and open pull requests. Theo merges and deploys |
| Local database | A throwaway local Postgres database. Production is never touched from this machine |

## Work streams and order

The work ships as three pull requests, in this order. Each one leaves the site working.

### PR 1: security upgrade

Branch `t3/security-upgrade`, from `main`.

GitHub reports 80 open Dependabot alerts, eight of them critical. They include remote code execution in the Next.js image optimizer, SQL injection in Payload's Postgres adapter, and remote code execution in the Payload form builder.

- Move `payload` and every `@payloadcms/*` package from 3.33.0 to 3.93.0.
- Move `next` from 15.2.6 to 16.4.x. The Next.js fixes landed in 15.5.28 and in 16. Payload 3.93 does not support the 15.5 line, so 16 is the only version that is both patched and supported.
- Move `react`, `react-dom`, `eslint-config-next` and `sharp` (0.35.5 or later) to match.
- Apply the Next 16 changes the repo needs: `next lint` is gone, so lint runs through `eslint` directly; check `middleware`, async request APIs and image config.
- Clear the remaining transitive alerts (fast-uri, brace-expansion, nanoid, js-yaml, axios, nodemailer and others) with `pnpm update`, and with `pnpm.overrides` only where an upgrade does not reach them.
- Add `.github/dependabot.yml` for weekly npm and GitHub Actions updates, with Payload packages grouped.
- Replace the leftover Mongo `docker-compose.yml` with a Postgres one, and fix `.env.example`.
- Let the site start without S3 credentials by falling back to local disk storage in development.

Done when: `pnpm build`, `pnpm lint` and `tsc --noEmit` pass; every existing route answers 200 against a seeded local database; the admin panel loads and saves a page; open Dependabot alerts drop to zero, or each one left is listed with a reason.

### PR 2: redesign

Branch `t3/website-redesign`, stacked on PR 1.

#### Design tokens

The Paper tokens become CSS variables in `globals.css` and Tailwind theme entries. Components use token names, never raw hex values.

- Colour: paper, ink, body, muted, rule, mist, cobalt, cobalt-soft, gold, gold-soft, and four tile tints (mint, rose, peach, sky).
- Type: Inter Tight 800 for display and Inter for body, loaded with `next/font`. Desktop scale H1 84 (home) and 64 (inner pages), H2 48, H3 32, H4 24, body 17. Phone scale H1 48 and 44, H2 34, H3 26, H4 22.
- Space: 4, 8, 12, 16, 20, 28, 40; gutter 64 (16 on phones); section gap 128 (72 on phones); 12 columns in a 1312 container.
- Radius: 12 for media, 24 for tiles, full for pills.
- The site ships in light mode only. The current dark theme toggle is removed.

One H1 per page. Section headings are H2. The cobalt full stop ends H1 and H2 headings and marks a live product; a hollow dot marks one that is not live.

#### Components

Atoms: `Button` (primary, secondary, ghost, on-ink), `Tag`, `StatusDot`, `Logo`, `Eyebrow`, `TextLink`.
Composites: `SiteHeader` with the phone menu, `SiteFooter`, `ProjectTile`, `LogoMarquee`, `ArticleRow`, `VideoFrame`, `OfferCard`, `AudienceRoutes`, `PageHeader`, `FactList`, `RoleRow`.

The marquee pauses on hover and stops for visitors who ask for reduced motion.

#### Content model

| Collection or global | Change |
|---|---|
| `projects` | Add status (live, building, private, retired), tile tint, tile image, logo, platforms, role, year, live URL, featured flag and homepage order, and case study sections (problem, approach, outcome, facts) |
| `experience` (new) | Company, logo, role, start and end dates, location, summary, outcome bullets, order |
| `posts` | Add a kind (article or video), video URL and length |
| `products` | Add a kind (consulting, template, merch), price label, external buy URL |
| `site-settings` | Hero copy, video resume URL and poster, contact email, social links, company logos for the strip |
| `skills`, `technologies` | Kept. Technologies show on case studies. The Skills block leaves the homepage |

#### Pages

| Route | Source |
|---|---|
| `/` | Home blocks: hero with video resume, logo strip, work bento, writing and video, shop, audience routes |
| `/projects` and `/projects/[slug]` | Work index with filters; case study |
| `/experience` | Roles from the new collection, softened figures, link to the PDF resume |
| `/about` | Story, portrait, signature |
| `/posts` and `/posts/[slug]` | Writing index; article |
| `/shop` | Consulting, templates, merch. `/products/[slug]` keeps working |
| `/contact` | Working form first, then direct links. This fixes the current "Form not available." message |

The homepage stays a CMS page built from blocks, so Theo can reorder sections in the admin panel. New blocks: `homeHero`, `logoMarquee`, `workBento`, `contentFeature`, `shopFeature`, `audienceRoutes`. Old template blocks stay registered so existing pages keep rendering.

#### Content

A seed script fills the local database with the real projects, roles, logos and tile images from `docs/design/assets`. The same script can load production once Theo has approved the copy. Copy I wrote as a placeholder is marked in the seed file and listed under "Needs Theo" below.

#### Database changes

Development pushes the schema automatically. For production, the PR includes a generated Payload migration. I need to confirm how production runs migrations today before Theo merges.

### Stream 3: video resume

No code dependency, so it runs alongside PR 2.

- A script of about 90 seconds, with a shot list naming the product footage for each line.
- A Synthesia draft using Theo's own avatar and voice, if his account has them. A stock avatar does not meet his requirement that it look exactly like him.
- A recording guide for the self-recorded version.
- The homepage hero embeds whichever version Theo picks. Until then it shows a poster frame.

## Verification

There is no test suite in the repo today, and I am not adding unit tests in this work.

Each PR is checked with: `pnpm build`, `pnpm lint`, `tsc --noEmit`, and a smoke script that requests every route on a local production build and asserts status 200 and the expected H1 text. PR 2 is also checked by eye, at 390 and 1440 wide, against the Paper boards.

The smoke script exercises the site through HTTP only. If Theo wants tests at other seams, we agree on them first.

## Out of scope

- Payload 4. It is still in beta.
- Tablet-specific layouts. The page reflows between the phone and desktop designs.
- A checkout. Shop items link out to where they are sold.
- Deploying to production. Theo merges and deploys.

## Needs Theo

- Review of placeholder copy: project counts, prices, consulting offers, the article text, the Cleanly case study, read times.
- A contact email address for the site.
- A higher-resolution portrait. The current one is a 460 pixel GitHub avatar.
- Fresh screenshots of Cleanly and DirectoryHub, which still show old branding.
- Access to his Synthesia avatar and voice, for the video draft.
- How production runs database migrations.
