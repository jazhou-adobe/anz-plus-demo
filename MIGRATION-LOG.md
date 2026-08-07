# ANZ Plus → Edge Delivery Services — Migration Log

> **Purpose:** living record of the migration of https://www.anz.com.au/plus/ into an Adobe
> Edge Delivery Services (EDS/AEM) site. Captures scope, tasks/jobs, decisions, outcomes,
> blocks built, technical learnings, and deploy status. Maintained as work continues, and
> intended as source material for a post-migration report / presentation.
>
> This file is `*.md` and is excluded from delivery by `.hlxignore` (never served publicly).

---

## 1. Project facts

| | |
|---|---|
| **Source site** | https://www.anz.com.au/plus/ |
| **Target EDS project** | GitHub `jazhou-adobe/anz-plus-demo` (branch `main`) |
| **Content authoring (DA)** | https://da.live/#/jazhou-adobe/anz-plus-demo |
| **Preview host** | https://main--anz-plus-demo--jazhou-adobe.aem.page/ |
| **Live host** | https://main--anz-plus-demo--jazhou-adobe.aem.live/ |
| **Basis** | Adobe `aem-boilerplate` (vanilla JS, no build step, block-based) |
| **Local dev** | `npx @adobe/aem-cli up --html-folder drafts` → http://localhost:3000 (drafts at `/drafts`) |

## 2. Scope

The full `/plus/` site is 20+ pages. Migration is being done in **reviewed increments**, not all at once.

| Increment | Pages | Status |
|---|---|---|
| Global chrome | Header/nav + footer (shared fragments) | ✅ Built, deployed to preview |
| Pilot | Home (`/`) + Accounts (`/accounts`) | ✅ Built, deployed to preview |
| Section landings +2 | Benefits (`/benefits`) + Home Loans (`/home-loans`) | ✅ Built locally, not yet deployed |
| Quality passes | Homepage fidelity pass, design-token fidelity pass | ✅ Done |
| Remaining | Support, and deeper sub-pages | ⏳ Not started |

**Nav-section landing coverage:** Why Plus/Benefits ✅ · Spend & Save/Accounts ✅ · Home Loans ✅ · Support ⏳

## 3. Delivery model (how work ships)

Two buses, per EDS:
1. **Code → git `main`** (blocks, styles, icons) — served from Code Bus.
2. **Content → DA** (page docs + nav/footer fragments) — uploaded via DA Source API, then
   `preview` (→ aem.page) and `publish` (→ aem.live) via the Admin API.

**Publish to live is gated on user review** — nothing has been published to production yet.

---

## 4. Task / job log (chronological)

### T1 — Environment setup ✅
`npm install`; started local aem-cli dev server (`--html-folder drafts`) in background. Serves
local uncommitted drafts at `/drafts/<name>`.

### T2 — Header/footer + Home + Accounts build (background agent) ✅
Faithful import of global chrome + the two pilot pages.
- **Output:** `drafts/nav.plain.html`, `drafts/footer.plain.html`, `drafts/index.plain.html`,
  `drafts/accounts.plain.html`; 29 real site images sideloaded into `drafts/images/`;
  `import-work/image-map.json` (original URL → local file map for DA sideloading).
- **New block:** `notice` (tinted callout panel). **Implemented:** `hero` (was an empty stub).
- **Design tokens (first cut):** brand navy `#1d164c`, accent blue `#006bde`, lavender tint
  `#f4f2fa`, Aeonik font stack (domain-locked → system fallback on localhost).
- **Outcome:** both pages rendered locally, 0 console errors, lint clean.

### T3 — Fidelity fix: Accounts card grid ✅
Accounts 4-item section was authored as a `columns` block → rendered as 4 stacked rows with
clipped button text. **Fix:** switched to `cards` block with an `accounts-cards` variant
(icon + eyebrow + heading + outline CTA); added scoped CSS so buttons wrap instead of
ellipsis-clipping. Now a proper 4-across responsive grid matching the source.

### T4 — Deploy pilot to DA (preview) ✅
- Code pushed to `main` (2 commits).
- DA auth via `da-auth-helper` (IMS token, interactive browser login).
- Uploaded `nav/footer/index/accounts` HTML to DA Source API; previewed all four.
- **Outcome:** preview host serves `/` and `/accounts` (HTTP 200, 0 console errors).

### T5 — Deploy bug fixes (found on preview) ✅
Two real defects the local preview hid, fixed and re-deployed:
1. **Footer link columns collapsed** — the 4 footer columns were bare grouping `<div>`s,
   which the **DA content pipeline flattens**. Rebuilt as a `columns.footer-links` block so
   the columns survive. → renders as 4-column grid on preview.
2. **Page Metadata leaked into the body + wrong SEO title** — the `metadata` block was its own
   top-level section. Per the EDS contract it must be the **last element of the last section**.
   Moved it inside the final section → `<title>`/`<meta description>` now correct, no visible
   metadata text.
- Added a no-op `blocks/metadata/` stub so local dev doesn't 404 on the block loader.

### T6 — Publish to live: **cancelled by user** ⛔
User chose to run the live publish themselves; then redirected to quality work first. Publish
remains on hold.

### T7 — Homepage fidelity critique (verified vs live) ✅
User flagged "many differences." Independent section-by-section verification confirmed the
homepage diverged significantly from the source (generic blocks used where the source uses
distinct treatments). Documented 11 differences + 2 broken images. Led to T8.

### T8 — Homepage fidelity pass (background agent + verification) ✅
Rebuilt the homepage to match the live design language across all 8 sections.
- **New blocks:** `iconnav` (horizontal icon row — "Explore"), `panel` (full-bleed color/tint/
  photo promo panels — the 4 sub-banners), `usps` (full-bleed blue "Why choose" with icon
  columns), `appjoin` (navy app section with QR + star rating).
- **`notice` variants added:** `pill` (Add-Ons banner), `center` (white centered card —
  "Smarter banking").
- **Hero:** darker left-weighted scrim for legibility.
- **Broken images fixed:** the 3 `usp-*.svg` icons were being mangled by `createOptimizedPicture`
  in the old `cards` block (produced un-processable `?format=svg` URLs); the new `usps`/`panel`
  blocks render them as raw `<img>`. All 25 homepage images now load.
- **Outcome:** independently verified vs live — all 8 sections match; 0 broken images; lint
  clean; Accounts page re-checked for regression (none).

### T9 — Migrate Benefits + Home Loans (background agent, disjoint files) ✅
Ran concurrently with T8 on a **disjoint file set** (shared files read-only) to avoid collision.
- **Pages:** `drafts/benefits.plain.html`, `drafts/home-loans.plain.html`.
- **New blocks:** `feature-panel`, `feature-cards`, `pill-nav`, `tick-list`, `rate-card`, `faq`.
- **Assets:** 23 `benefits-*` + 15 `hl-*` images; per-page image maps
  (`import-work/image-map-benefits.json`, `image-map-home-loans.json`).
- **Shared-change requests** logged (not applied) in `import-work/DEFERRED-shared-changes.md`.
- **Outcome:** both render locally, 0 console errors, 0 broken images, single-H1 hierarchy,
  lint clean. Honest fidelity noted; minor gaps: Home Loans "Get ahead" carousel rendered as a
  static grid; rate figures + rate toggle static; hero house is a static PNG from a Lottie.

### T10 — Design-token fidelity pass (measured) ✅
Measured **computed** styles from the live site (desktop 1440 + mobile 390) and pinned
`styles/styles.css :root` to real values.
- Heading scale corrected to mobile-first: **h1 32→64px, h2 24→32px** (was inverted/oversized).
- Body **16px** (was 18–22px); body line-height **1.5**.
- **Heading weight 600 → 500** (ANZ headings are medium, not bold) — the biggest "feel" fix;
  heading line-height 1.15 + `-0.01em` tracking.
- Hero H1 switched from a bespoke 36/44/52px to the global token → **exact 64/32px live match**.
- **Outcome:** verified h1/h2 match live to the pixel; 0 broken images; lint clean. Applies
  globally, so Benefits/Home Loans inherit the corrected type automatically.

### T11 — Migration log (this file) ✅ / ongoing
Created this living record for the eventual report. Updated as work continues.

### T12 — Homepage bug-fix pass (user-spotted, verified vs live) ✅
User reviewed the homepage and flagged 8 fidelity bugs; all fixed and measured against live:
1. **Add-Ons pill** — added the announcement icon (`addon-icon.png`); link recoloured to grey
   `#424242` (was brand-blue); font bumped from 12→14px.
2. **Header "Get Started"** — scoped to 14px / 12×24 padding (was inheriting the 16px content size).
3. **Hero** — was using the **mobile** image crop (`...campaign-m.jpg`); swapped to the **desktop**
   wide crop (`...campaign-d.jpg`, 3:1). Removed the section vertical margins + wrapper max-width so
   the hero is truly edge-to-edge full-bleed.
4. **"Explore ANZ Plus" heading** — centered, reduced to a 20px label (was a left 32px h2).
5. **Smarter banking** — lotus icon recoloured navy→blue (`usp-lotus-blue.svg`).
6. **Sub-banner panels** — phone/illustration tiles scaled up; My Accounts phone bleeds to the
   panel's bottom edge (matching live).
7. **Footer** — the **local** preview was loading a stale flat root fallback; synced
   `nav.plain.html`/`footer.plain.html` root copies → 4-column grid renders locally. Restyled:
   links 14px `#6f6f6f`, headings 24px, black body text.
8. **Footer acknowledgement / legal** — muted smaller print styling.
- **Root causes captured:** (a) buttons split into two sizes — content CTA 16px vs header 14px —
  the token pass had unified them at 16px; (b) hero used the mobile image variant; (c) local
  `--html-folder` footer loads a root fallback that must be kept in sync with `drafts/`.
- **Outcome:** all 8 verified by computed-style measurement + screenshot vs live; lint clean;
  0 broken images. **Not yet re-deployed** (batched with the pending push).

---

## 5. Blocks inventory (built during migration)

| Block | Purpose | Introduced in |
|---|---|---|
| `hero` | Full-bleed photo hero + scrim + overlaid heading/CTA | T2 (impl), T8 (scrim), T10 (type) |
| `notice` | Tinted callout panel; variants `pill`, `center` | T2, T8 |
| `cards` (variant `accounts-cards`) | Icon+eyebrow+heading+CTA grid | T3 |
| `columns` (variant `footer-links`) | Footer 4-column link grid | T5 |
| `metadata` | No-op stub (prod strips server-side) | T5 |
| `iconnav` | Horizontal small-icon row ("Explore") | T8 |
| `panel` | Full-bleed color/tint/photo promo panels | T8 |
| `usps` | Full-bleed blue section w/ icon columns | T8 |
| `appjoin` | Navy app-download section w/ QR + stars | T8 |
| `feature-panel` | Split promo panel; variants blue/navy/sky/tint/center | T9 |
| `feature-cards` | Card grid; variants reviews/cols-2 | T9 |
| `pill-nav` | Pill anchor-link row | T9 |
| `tick-list` | Multi-column green-tick checklist | T9 |
| `rate-card` | Navy panel w/ large rate figures | T9 |
| `faq` | Native `<details>` accordion | T9 |

## 6. Design tokens (final, measured from live)

- **Colors:** `--text-color/--brand-navy #1d164c` · `--link-color/--brand-accent #006bde` ·
  `--brand-blue #0572e6` · `--light-color #f4f2fa` · `--dark-color #4a4458`.
- **Type scale (desktop / mobile):** h1 64/32 · h2 32/24 · h3 24/20 · body 16/16.
  Heading weight 500, line-height 1.15; body line-height 1.5. Font: Aeonik (domain-locked →
  Helvetica Neue/Arial fallback on localhost).
- **Nav height:** 72px. **Buttons:** pill, primary solid `#006bde`, secondary blue-outline.

## 7. Key technical learnings (report-worthy)

1. **DA pipeline flattens bare `<div>`s** — any multi-column/multi-cell layout must live inside a
   recognized *block*, or the grouping divs are stripped. (Caused the footer-columns bug, T5.)
2. **Page Metadata block placement** — must be the *last element of the last section*, not its
   own section, or SEO meta tags aren't emitted and the block renders as visible text. (T5.)
3. **`createOptimizedPicture` breaks SVGs** — produces `?format=svg` renditions the pipeline
   can't process → broken images. Render SVG icons as raw `<img>`. (T8.)
4. **Buttons are authored** — a link becomes a button only when wrapped in `<strong>` (primary)
   / `<em>` (secondary); and only when it's the sole content of its `<p>`.
5. **Section styling hooks off block classes** — `scripts/aem.js` (never modified) ignores
   `section-metadata`; wrap a section in a block and style via its class for full-bleed color.
6. **Local `--html-folder` preview ≠ production** — it doesn't process the metadata nav/footer
   rows or flatten divs the way DA does; always verify on the aem.page preview after deploy.
7. **Measure, don't guess, design tokens** — computed-style sampling of the live site corrected
   an inverted heading scale and a too-bold heading weight that "looked off." (T10.)
8. **Verify agents, don't trust self-grades** — a background agent reported "~95% match" on a
   homepage that in fact diverged materially; independent screenshot verification caught it. (T7.)
9. **Concurrency discipline** — parallel agents must work on disjoint file sets; shared files
   get a single writer, others read-only + log deferred changes. (T8 ‖ T9.)

## 8. Current status

- **On `main` (code):** header/footer/hero/notice/cards/columns/metadata + homepage blocks
  (iconnav/panel/usps/appjoin) + token changes. **Benefits/Home-Loans blocks are built locally
  but NOT yet committed/pushed.**
- **On DA preview (content):** `nav`, `footer`, `index` (older pre-fidelity version), `accounts`.
  **The improved homepage and the Benefits/Home-Loans pages are NOT yet re-uploaded.**
- **On live:** nothing published (gated on user review).

## 9. Pending / next

- [ ] Fold `import-work/DEFERRED-shared-changes.md` token suggestions into `:root`.
- [ ] Commit + push Benefits/Home-Loans blocks and token changes to `main`.
- [ ] Re-upload improved homepage + new Benefits/Home-Loans content to DA preview.
- [ ] Final 4-page verification vs live (home, accounts, benefits, home-loans).
- [ ] User review → publish to live.
- [ ] Migrate Support section (4th nav landing) + remaining sub-pages.

---

*Last updated: 2026-08-07 (through T12 homepage bug-fix pass; all changes local, pending re-deploy).*
