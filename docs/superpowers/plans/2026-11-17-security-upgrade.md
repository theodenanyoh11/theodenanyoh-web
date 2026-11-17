# Security Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the site to Payload 3.93 and Next.js 16.4 and clear the open Dependabot alerts, with no visible change to the site.

**Architecture:** Dependency upgrade only. A smoke script that requests every route over HTTP is written first, run green on the current versions as a baseline, and must stay green after each upgrade step. Local work runs against a throwaway Postgres database and local disk storage.

**Tech Stack:** Payload CMS 3.93, Next.js 16.4, React 19, Postgres, pnpm 10, Node 24.

**Spec:** `docs/superpowers/specs/2026-11-17-website-redesign-design.md` (section "PR 1: security upgrade")

## Global Constraints

- Branch `t3/security-upgrade`, cut from `main`. The untracked `docs/` folder stays on `t3/website-redesign`.
- `payload` and every `@payloadcms/*` package pinned to exactly `3.93.0`.
- `next` at `16.4.x` (16.3.3 or later is the range Payload 3.93 supports; 15.5 is not supported).
- `sharp` at `0.35.5` or later.
- No visible change to any page. No schema change.
- Local database name `theodenanyoh_web_dev` on the Postgres already running at `localhost:5432`. Never connect to production.
- `.env` is never committed.
- Commit messages and PR text follow the `unslop` rules: no em dashes, plain words.
- Never merge to `main` and never deploy. Theo does both.

## Review Focus

- A production database on the 3.33 schema: Payload 3.93 may expect new internal columns or tables. Expect `payload migrate:status` to show what a deploy needs, and the PR to say so.
- A page with a form block: the form builder had the critical fix, so a form must still render and submit.
- Missing S3 variables in development: the site must start and serve media from local disk.
- Media with a remote S3 URL: `next/image` must still accept the bucket hostname under the Next 16 image config.
- Draft preview and the admin live preview: both rely on request APIs that changed between Next 15 and 16.

---

### Task 1: Local environment and baseline smoke script

**Files:**
- Create: `.env` (not committed), `scripts/smoke.mjs`, `docker-compose.yml` (replace Mongo template)
- Modify: `.env.example`, `src/payload.config.ts` (S3 plugin only when `S3_BUCKET` is set), `package.json` (script `smoke`)

**Interfaces:**
- Produces: `pnpm smoke [baseUrl]`. It requests `/`, `/posts`, `/projects`, `/search`, `/admin/login`, `/sitemap.xml`, plus the first document slug from `/api/posts`, `/api/projects`, `/api/products` and `/api/pages`. It prints one line per route and exits 1 if any status is not 200 or any HTML page lacks an `<h1`. Default base URL `http://localhost:3000`.

- [ ] **Step 1:** Create branch `t3/security-upgrade` from `main` in this worktree. Carry the untracked `docs/` folder along uncommitted, or commit it on `t3/website-redesign` first.
- [ ] **Step 2:** `createdb theodenanyoh_web_dev`; write `.env` with `DATABASE_URI=postgres://localhost:5432/theodenanyoh_web_dev`, a random `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL=http://localhost:3000`.
- [ ] **Step 3:** In `src/payload.config.ts`, include `s3Storage(...)` only when `process.env.S3_BUCKET` is set. Without it Payload stores uploads on local disk.
- [ ] **Step 4:** `pnpm install`, `pnpm dev`, create the first admin user, seed through the admin "Seed your database" button (POST `/next/seed`).
- [ ] **Step 5:** Write `scripts/smoke.mjs` to the interface above. Run it against `pnpm build && pnpm start`. Expected: every line `200`, exit 0. Record the output as the baseline. If a route fails on the old versions, record that as a known failure and do not fix it in this PR.
- [ ] **Step 6:** Replace `docker-compose.yml` with a single `postgres:16` service; fix the Mongo-era text in `.env.example`.
- [ ] **Step 7:** Commit: `chore: add local Postgres setup and route smoke script`.

### Task 2: Payload 3.33 to 3.93

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`, `src/app/(payload)/**` (generated files), `src/payload-types.ts`, any source file the type checker flags

- [ ] **Step 1:** Read the Payload release notes from 3.34 to 3.93 for breaking changes (use context7 or the GitHub releases page). List the ones that touch this repo in the commit body.
- [ ] **Step 2:** Set `payload` and all thirteen `@payloadcms/*` packages to `3.93.0`. Keep `next` at 15.2.x for this task, raised to `15.2.9` so the peer range is met. `pnpm install`.
- [ ] **Step 3:** `pnpm generate:importmap && pnpm generate:types`. Compare `src/app/(payload)` files with the 3.93 website template and update them if the template changed.
- [ ] **Step 4:** `pnpm exec tsc --noEmit` and `pnpm build`. Fix each error at its source.
- [ ] **Step 5:** `pnpm start`, then `pnpm smoke`. Expected: same lines as the baseline.
- [ ] **Step 6:** In the admin panel, edit and save one page, upload one image, submit the contact form. Expected: all three succeed.
- [ ] **Step 7:** `pnpm payload migrate:status`. Note the result for the PR body.
- [ ] **Step 8:** Commit: `chore: upgrade Payload to 3.93.0`.

### Task 3: Next.js 15.2 to 16.4

**Files:**
- Modify: `package.json`, `pnpm-lock.yaml`, `next.config.js`, `eslint.config.mjs`, `tsconfig.json`, any file the codemod or type checker flags

- [ ] **Step 1:** Load the `vercel:next-upgrade` skill and follow it. Run `pnpm dlx @next/codemod@latest upgrade 16.4` and review its diff.
- [ ] **Step 2:** Set `next` and `eslint-config-next` to the latest `16.4.x`, `react` and `react-dom` to the latest `19.x`, with matching `@types`. Set `sharp` to `^0.35.5`.
- [ ] **Step 3:** Replace the `lint` and `lint:fix` scripts with `eslint .` and `eslint . --fix`. Move `eslint.config.mjs` to the flat config that `eslint-config-next` 16 exports, keeping the five rule overrides.
- [ ] **Step 4:** Check `next.config.js` against the Next 16 config reference: `images.remotePatterns`, `rewrites`, and the operator-precedence bug in `NEXT_PUBLIC_SERVER_URL` (`undefined || ...` binds inside the ternary's else branch; keep behaviour, remove the dead `undefined`).
- [ ] **Step 5:** `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`. Fix each error at its source.
- [ ] **Step 6:** `pnpm start`, then `pnpm smoke`. Expected: same lines as the baseline. Repeat the three admin checks from Task 2 Step 6, and open a draft preview of one post.
- [ ] **Step 7:** Commit: `chore: upgrade Next.js to 16.4 and sharp to 0.35`.

### Task 4: Remaining alerts and Dependabot config

**Files:**
- Create: `.github/dependabot.yml`
- Modify: `package.json` (`pnpm.overrides` only where needed), `pnpm-lock.yaml`

- [ ] **Step 1:** `pnpm update` within existing ranges, then `pnpm audit --json`. For each advisory still open, run `pnpm why <package>`.
- [ ] **Step 2:** Where a direct dependency can be raised to pull in the fix, raise it. Where it cannot, add a `pnpm.overrides` entry pinned to the first patched version from the alert, scoped to the vulnerable major (for example `"fast-uri@<3.1.9": "^3.1.9"`).
- [ ] **Step 3:** `pnpm install`, `pnpm build`, `pnpm start`, `pnpm smoke`. Expected: baseline lines.
- [ ] **Step 4:** `pnpm audit`. Expected: no high or critical advisories. List any that remain, with the reason, for the PR body.
- [ ] **Step 5:** Write `.github/dependabot.yml`: ecosystem `npm`, weekly, one group named `payload` matching `payload` and `@payloadcms/*`, one group `next-react`; ecosystem `github-actions`, weekly.
- [ ] **Step 6:** Commit: `chore: clear remaining audit findings and add Dependabot config`.

### Task 5: Pull request

- [ ] **Step 1:** Push `t3/security-upgrade`. Open a PR against `main` titled "Upgrade Payload to 3.93 and Next.js to 16.4". The body lists: versions before and after, alerts cleared and any left with reasons, the smoke output, the `migrate:status` result, and what Theo must check on a preview deploy (admin login, one page save, one form submit, one image).
- [ ] **Step 2:** After GitHub rescans the branch, read the Dependabot alert count for the PR head and add it to the PR.
