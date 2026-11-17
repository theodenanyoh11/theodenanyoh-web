# Redesign Build Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Paper redesign of theodenanyoh.com in code, on top of the upgraded stack.

**Architecture:** Design tokens live as CSS variables and Tailwind theme entries. Small presentational components in `src/components/site` are shared by six new homepage blocks and eight routes. Content comes from Payload collections; a seed script loads the real projects, roles and images so every page renders locally.

**Tech Stack:** Next.js 16.4 App Router, Payload 3.93, Tailwind 3, `next/font` (Inter Tight, Inter), Postgres.

**Spec:** `docs/superpowers/specs/2026-11-17-website-redesign-design.md` (section "PR 2: redesign")

## Global Constraints

- Branch `t3/website-redesign`, stacked on `t3/security-upgrade`.
- Read `node_modules/next/dist/docs/` before using a Next API (see `AGENTS.md`).
- Colours: paper #FFFFFF, ink #0A0A0A, body #3A3A3A, muted #5C5C5C, rule #E4E4E4, mist #F3F4F8, cobalt #1F3BFF, cobalt-soft #E9ECFF, gold #F5B700, gold-soft #FFF6D6, mint #E4F0EB, rose #FDE9EA, peach #FFE9C7, sky #E6F0FF. Components use token names, never hex.
- Type: Inter Tight 800 display, Inter body. Desktop H1 84/84 (home) and 64/64 (inner), H2 48/52, H3 32/36, H4 24/28, body 17/26, label 14 caps 0.08em. Phone H1 48 (44 inner), H2 34/38, H3 26/30, H4 22/26.
- Layout: 1312 container, gutter 64 desktop and 16 phone, section gap 128 desktop and 72 phone. Radius 12 media, 24 tile, full pill.
- One H1 per page. Section headings are H2. H1 and H2 end with a cobalt full stop.
- Light mode only.
- The site never says "open to work". The hero does not name an employer. Result figures on Experience are softened ("eight-figure revenue impact", "a third fewer support contacts").
- Not on the site: buyHCM, the Paychex support concept, marsHedge real figures.
- Copy follows the `unslop` rules. Placeholder copy is marked `PLACEHOLDER` in the seed file.
- Verification is `tsc --noEmit`, `pnpm lint`, `pnpm build`, `pnpm smoke`, and screenshots at 390 and 1440 against the Paper boards. No unit tests.
- Every schema change ships with an additive, idempotent migration, checked the same way as in PR 1.

## Review Focus

- A project with no tile image or logo: the tile must still render, using its tint and name.
- An empty collection (no posts, no products, no experience): each section hides or shows an empty state, and no page errors.
- The video resume URL is unset: the hero shows the poster with no broken player.
- Reduced motion: the logo marquee does not move.
- Keyboard and screen reader use of the phone menu: it opens, traps focus, closes on Escape, and returns focus to the button.
- Existing CMS pages built from old template blocks: they still render under the new tokens.

---

### Task 1: Tokens, fonts and base styles

**Files:** Modify `src/app/(frontend)/globals.css`, `tailwind.config.mjs`, `src/app/(frontend)/layout.tsx`. Remove theme switching (`src/providers/Theme/**`, `InitTheme`, the `html { opacity: 0 }` rule) and its uses.

**Produces:** Tailwind colours `paper ink body muted rule mist cobalt cobalt-soft gold gold-soft mint rose peach sky`; font families `font-display`, `font-sans`; type utilities `text-h1 text-h1-page text-h2 text-h3 text-h4 text-body text-label` that switch size at the `lg` breakpoint; `rounded-media`, `rounded-tile`; class `site-container` (1312 max, 16 and 64 gutters); class `section` (72 and 128 vertical gap). The shadcn variables (`--background`, `--primary`, and so on) are remapped to the new palette so existing `ui` components keep working.

- [ ] Implement, then `pnpm build` and `pnpm smoke`. Commit.

### Task 2: Site components

**Files:** Create in `src/components/site/`: `Button.tsx`, `Tag.tsx`, `StatusDot.tsx`, `Logo.tsx`, `Eyebrow.tsx`, `TextLink.tsx`, `Heading.tsx` (adds the cobalt full stop), `PageHeader.tsx`, `ProjectTile.tsx`, `LogoMarquee.tsx`, `ArticleRow.tsx`, `VideoFrame.tsx`, `OfferCard.tsx`, `AudienceRoutes.tsx`, `FactList.tsx`, `RoleRow.tsx`. Rewrite `src/Header/**` and `src/Footer/**`.

**Produces:**
- `Button({ href?, variant: 'primary' | 'secondary' | 'ghost' | 'onInk', size?: 'md' | 'lg', children })`
- `Heading({ as: 'h1' | 'h2' | 'h3', size?: 'h1' | 'h1-page' | 'h2' | 'h3', children, stop?: boolean })`
- `StatusDot({ status: 'live' | 'building' | 'private' | 'retired' })`
- `ProjectTile({ project: Project, span?: 4 | 6 | 8 | 12 })`
- `LogoMarquee({ items: { name: string; logo?: Media }[] })`
- `PageHeader({ eyebrow?, title, intro? })`
- Header nav: Work, Experience, About, Writing, Shop, plus a "Get in touch" button. On phones a full-screen ink menu.

- [ ] Implement, build, smoke, screenshot header and footer at both widths. Commit.

### Task 3: Content model and migration

**Files:** Modify `src/collections/Projects/config.ts`, `Posts/index.ts`, `Products/config.ts`, `src/globals/SiteSettings.ts`, `src/payload.config.ts`. Create `src/collections/Experience/config.ts`, `src/migrations/<timestamp>_redesign.ts`.

**Produces (field names):**
- `projects`: existing `status` values stay; add `stage: 'live' | 'building' | 'private' | 'retired'`, `tint: 'mint' | 'rose' | 'peach' | 'sky' | 'mist' | 'cobalt-soft' | 'gold-soft' | 'ink'`, `tileImage` (upload), `logo` (upload), `platforms` (select, many: web, ios, android), `role` (text), `year` (text), `homeOrder` (number), `tileSpan: '4' | '6' | '8' | '12'`, `caseStudy` group: `problem`, `approach`, `outcome` (rich text), `facts` (array of `label`, `value`). `mainImage` and `description` become optional.
- `experience` (slug `experience`): `company`, `logo`, `role`, `startDate`, `endDate`, `current`, `location`, `summary`, `outcomes` (array of `text`), `order`.
- `posts`: add `kind: 'article' | 'video'`, `videoUrl`, `duration`, `readTime`.
- `products`: add `kind: 'consulting' | 'template' | 'merch'`, `priceLabel`, `ctaLabel`.
- `site-settings`: add `hero` group (`eyebrow`, `headline`, `intro`, `primaryCta`, `secondaryCta`), `videoResume` group (`url`, `poster`, `duration`), `contactEmail`, `resumeUrl`, `social` array (`label`, `url`), `logoStrip` array (`name`, `logo`), `about` group (`portrait`, `signature`, `story` array of `title`, `body`).

- [ ] Implement, `pnpm generate:types`, write the migration from a schema diff, verify it on a copy of the PR 1 schema. Commit.

### Task 4: Seed

**Files:** Create `src/endpoints/seed/redesign/` (`index.ts`, `projects.ts`, `experience.ts`, `site.ts`, `posts.ts`, `products.ts`), route `src/app/(frontend)/next/seed-redesign/route.ts` (authenticated POST).

Content comes from `docs/design/assets` and the facts in the spec. The seed is idempotent: it upserts by slug.

- [ ] Implement, run against the local database, confirm counts. Commit.

### Task 5: Home blocks

**Files:** Create `src/blocks/HomeHero`, `LogoMarqueeBlock`, `WorkBento`, `ContentFeature`, `ShopFeature`, `AudienceRoutesBlock` (each `config.ts` and `Component.tsx`). Modify `src/collections/Pages/index.ts`, `src/blocks/RenderBlocks.tsx` (new blocks render without the `my-16` wrapper).

- [ ] Implement, seed the home page layout, compare with Paper "Home · 1440" and "Home · 390". Commit.

### Task 6: Inner pages

**Files:** Modify `src/app/(frontend)/projects/**`, `posts/**`, `products/**`. Create `experience/page.tsx`, `about/page.tsx`, `shop/page.tsx`, `contact/page.tsx`.

- [ ] One route at a time: implement, add it to `scripts/smoke.mjs`, compare with its Paper boards. Commit after each pair of routes.

### Task 7: Review and pull request

- [ ] Full check run, a fresh reviewer on the branch, fixes, then a PR against `t3/security-upgrade` with screenshots.
