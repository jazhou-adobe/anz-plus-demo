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
10. **DA's markdown round-trip strips non-block classes** — a class on a plain `<p>`/`<div>` that
    isn't a recognized block's top-level class is silently dropped on DA (but renders fine on local
    `--html-folder` preview, masking the bug until upload). Style such elements structurally
    (`:first-child`, `:has()`) instead. (T19.)
11. **A literal `<table>` on a page is parsed via the EDS block-table convention** — DA consumes its
    first row as a block name, corrupting or silently dropping data (caught deleting a real fee row
    in production). Author tabular data as `<ul><li>` label/value pairs instead of `<table>`. (T20.)
12. **A custom block needs the full block → row → *cell* div nesting**, not just block → row, or DA
    won't recognize it as a block and drops its class/wrapper on upload, even though it renders
    correctly locally. Bit `hls-link-list` once (T20) and the shared `notice` block on 5 pages —
    index, accounts, everyday-transaction, transact, joint-bank-accounts (T21) — proving this isn't
    a one-off, it's a per-instance authoring risk that needs checking on every block usage.
13. **`<dl>`/`<dt>`/`<dd>` doesn't survive DA's round-trip** — it's flattened to an unstyled
    `<ul><li><p><p></li></ul>` with all classes stripped. Avoid `<dl>` in authored block content;
    use plain paragraphs/lists styled structurally. (T20.)
14. **Browser `img.complete`/`naturalWidth` checks false-positive on `loading="lazy"` images** under
    headless/programmatic scrolling — verify broken images via direct HTTP status on every `<img>`
    src instead of DOM load-state. (T20.)
15. **`localhost:3000` (bare root) proxies the *remote* DA preview; only explicit `/drafts/<slug>`
    paths serve the local draft file** — this is why a page can look correct at `/drafts/<slug>`
    but broken at `/<slug>` (or on `aem.page`): the drafts server never runs content through DA's
    pipeline, so it can't reproduce DA-side corruption. Treat `/<slug>` on localhost (or the real
    `aem.page` preview) as the DA-fidelity check, and `/drafts/<slug>` as the code-fidelity check —
    they test different things and both must be green. (T21.)
16. **`width: 100vw` full-bleed breakouts need `box-sizing: border-box`** — without it, horizontal
    padding is added on top of the 100vw width instead of being absorbed within it, causing
    page-wide horizontal overflow at any viewport, invisible at typical desktop widths but severe
    at 2K+ (760px of padding per side inflated a panel to 4080px on a 2560px viewport). A block
    with `flex:1` image children compounds this into ~2x image upscaling and ballooned section
    height. (T22.)
17. **Don't assume a design token from a single reference screenshot** — T17 pinned the hero to
    ~480px from a user-supplied image; precise cross-width measurement in T22 found the real value
    is a fixed 640px. Measure the *live* source at multiple widths before calling a value final.
    (T22.)
18. **A page's own body content can cross-link to pages beyond its "obvious" scope** — when
    moving/renaming pages, grepping only the moved files' own old names misses pages that merely
    *reference* them. A full site-wide link crawl (every page → every local `href` → HTTP status)
    is the only reliable way to catch this; targeted greps caught the file list to move, but only
    the crawl caught 2 stationary pages whose links had been fixed locally but never re-uploaded.
    (T23.)
19. **Files and folders sharing a base name coexist fine** in the local filesystem, DA's source
    storage, and the aem-cli dev server's routing — a landing page `support/home-loans` and a
    child page `support/home-loans/eligibility` are not a naming conflict (the file always carries
    an extension; the folder never does). Verified empirically before committing to this
    hierarchy shape, not assumed. (T23.)
20. **Deleting a DA source doc does not retire its already-generated preview** — the old flat path
    kept serving stale content until the Admin API's preview-delete endpoint was also called.
    Moving/retiring a page needs both: delete the source, delete the preview. (T23.)

### T13 — Header mega-menu dropdown + batch deploy to preview ✅
- **Dropdown fidelity:** user flagged the header dropdown didn't match. Live shows each submenu
  item as a **bold title + grey description** on a light-grey rounded panel. Rebuilt `nav.plain.html`
  submenu items as `<a><strong>Title</strong> description</a>` (survives the DA class-stripping),
  restyled the dropdown in `header.css` (320px light-grey `#f4f3f4` panel, 12px radius, soft shadow,
  navy titles + grey descriptions). Extracted the real descriptions from the live mega-menu.
- **Batch deploy (code → main, content → DA preview):**
  - Pushed all code to `main` (blocks + styles + log) — commit `1fc0f4d`.
  - Pre-uploaded 4 locally-derived images to DA `/media` (no source URL): `usp-lotus-blue.svg`,
    `hl-hero-house.png`, and two **rasterized QR PNGs**.
  - **QR-cap gotcha:** the source QR **SVGs are ~156KB** — over DA's 40KB SVG cap → preview 409
    ("error from content-bus"). Rasterized both to 600×600 PNG (`rsvg-convert`), pre-uploaded, and
    mapped the refs to the PNGs. Preview then 200.
  - Uploaded + previewed all 6 docs (`nav, footer, index, accounts, benefits, home-loans`).
- **Verified on the preview host** (`aem.page`): all 4 content pages 0 broken images, 0 page errors,
  correct titles (home 29 imgs/9 sections, accounts 10/4, benefits 32/20, home-loans 21/12).
- **Live publish still on hold** for user review.

### T14 — Full-site migration: remaining 22 pages + nav/footer relink ✅
Migrated every remaining navigable `/plus/` page via **4 parallel agents** on disjoint page sets and
disjoint new-block namespaces (`acct-`/`why-`/`hls-`/`util-`), then a central deploy pass.
- **Pages (22):** add-ons, coaches, download, eligibility, everyday-transaction, explore-loans,
  feedback-complaints, flex-saver, growth-saver, interest-fees, joint-bank-accounts, my-accounts,
  new-to-australia, privacy, refinance-calculator, save, security, support, support-home-loans,
  switch-to-plus, terms-conditions, transact. (`/transact` mirrors everyday-transaction — source 301.)
- **New blocks (7):** `acct-rate-cards`, `hls-calculator`, `hls-eligibility`, `hls-link-list`,
  `hls-band`, `util-download-hero`, `util-link-cards`. Committed to `main` (`8cb2b44`). The `why-`
  agent needed **zero** new blocks — the library now covers most layouts.
- **Central deploy handling:**
  - Normalised **5 different agent image-map schemas** into one basename→URL lookup (206 entries).
  - Rasterized 2 more over-cap QR SVGs (util-download 149KB, hls-switch 153KB) → PNG, pre-uploaded
    to DA `/media`; why-page QRs reused the shared `join-qr`.
  - Built + uploaded + previewed all 24 docs (nav, footer, 22 pages).
- **Nav/footer relinked to local slugs** (user request): rewrote every migrated internal link in
  `nav.plain.html`/`footer.plain.html` from absolute `anz.com.au/plus/...` to local slugs; only the
  two genuinely-external links (Banking Code, Financial Claims Scheme) stay absolute.
- **Verified on preview host:** all 26 slugs HTTP 200; broken-image + page-error sweep across the 22
  new pages = **0 pages with issues**.
- **Honest fidelity gaps** (per agent reports): interactive tools (refinance calculator, eligibility
  flow, rate toggles) rendered as faithful STATIC default states; a few source carousels rendered as
  static grids; some full-bleed colour bands approximated. Content is complete/verbatim.
- **Live publish still on hold** for user review.

### T15 — Header mega-menu rebuild (user-flagged) ✅
The earlier "dropdown" was a narrow single-column list; the source is a **full-width mega-menu**:
a grey left panel of icon+title+description cards, plus "Explore more" and "I want to" arrow-link
columns (with a NEW badge). Rebuilt faithfully:
- **Content:** re-authored `nav.plain.html` per section with a **DA-safe flat-list convention** —
  a text-only `<li>` starts a column (its text = heading), items with an `<img>` become featured
  cards, `(NEW)` becomes a badge. Extracted the real per-section structure + 14 mega-menu icons
  from the live nav.
- **Code:** `header.js` gained `buildMegaMenu()` (parses the flat list into a 3-column panel);
  `header.css` lays out the full-width panel (grey-left gradient, icon cards, arrow links, badge),
  anchored to `.nav-wrapper` by making the drop `<li>` static and moving the chevron to the link.
  Committed to `main` (`cb24883`).
- **Deploy:** mega icons mapped to source URLs; nav rebuilt + uploaded + previewed to DA.
- **Verified on preview host:** full-width (1440px), 3 columns, 4 featured cards, NEW badge,
  **0 broken icons**.
- One stylelint `no-descending-specificity` rule waived file-scoped (component-grouped ordering,
  not a defect).

### T16 — Mega-menu behavior/layout + header-height fixes (user-flagged) ✅
Follow-ups on the mega-menu, all verified on the **deployed** site:
- **Click behavior:** the top label now toggles the mega-menu instead of navigating (desktop);
  submenu links still navigate. `header.js` click handler intercepts only the label link.
- **DA `<p>`-wrap:** the delivered nav has each label link wrapped in a `<p>` by the DA editor,
  which broke the chevron/click selectors and inflated the header. `header.js` now unwraps that
  `<p>` at decorate time, and `buildMegaMenu` matches item links via `li.querySelector('a')` so it
  is robust to the wrap. (Root-caused from the delivered `nav.plain.html`.)
- **Featured card layout:** icon | title-over-description, left-aligned, no arrow — matched to the
  source. Fixed a specificity clash where the link-column rule (`display:flex; space-between`) was
  overriding the featured grid (excluded featured via `:not(.mega-featured)`).
- **Header height:** `--nav-height` set to **89px** per the source.
- Committed to `main` (`f2b449a`); code-sync verified live (header 89px, label-click no-nav,
  3 columns, 4 cards, 0 broken icons).

### T17 — Homepage section fidelity to reference images (user-supplied) ✅
Pixel-level matches against user reference screenshots, all deployed + verified on `aem.page`:
- **Mega-menu:** fixed **629px** height, **423px** grey left panel (featured column overhangs to
  600px so grey bleeds left and link columns sit right with empty space); featured cards
  icon | title-over-description, left-aligned; blue/underline hover on card titles.
- **Hero:** shortened to ~**480px** (`box-sizing: border-box`) so the desktop 3:1 image shows the
  full scene uncropped; stronger left scrim; H1 two lines.
- **Start-banking tint panel:** lighter cyan-blue `#e2f6fd`.
- **Smarter banking:** confirmed already matching (white card, blue lotus, blue pill).
- Committed `b3d838f`; verified live (hero 480, mega 629/423).

### T18 — Continued page-by-page fidelity pass: Homepage/Accounts/Benefits/Home Loans/Support ✅
Systematic section-by-section comparison of each primary nav page's **local draft** against the
**live source**, fixing real gaps (not cosmetic nitpicks). All verified on `localhost:3000/drafts/*`
then synced to DA preview.
- **Footer** (shared, every page): source is centered (logo/legal/badges) with an **acknowledgement-
  of-country card** (indigenous artwork + ANZ Plus Pride logo, reconciliation + "Learn more" links)
  that was missing entirely; also missing the **"ANZ Plus Credit Guide"** link in Important
  Information. Rebuilt the acknowledgement as its own footer section, centered the chrome, added
  the missing link. Art asset (633KB source SVG, over DA's 40KB cap) rasterized to a 480px PNG and
  uploaded to DA `/media`.
- **Accounts**: source hero is a **centered blue heading + phone screenshot below** (not a full-bleed
  photo banner) — added a `hero.product` variant. Source account cards are a **2-up grey-band
  grid** with blue uppercase eyebrows and a bottom-anchored illustration, not a 4-up icon grid —
  reworked `accounts-cards`. "Starter pack" is a plain centered grey band, not a lavender card —
  added `notice.band`.
- **Benefits**: source feature-panel/feature-cards headings are **brand-blue**, not navy — this was
  the dominant "feel" gap, fixed globally (cascades to every page using these blocks). "Smash your
  goals" was solid-blue locally vs light-blue-tint in source — switched to the `tint` variant.
- **Home Loans**: pill-nav intro heading is centered in source (pills were already centered) — fixed.
  Rate-toggle (Live-in/Investment) and the refinance calculator's live-fetch results remain
  accepted static-default simplifications (interactive tooling out of scope per T9/T14).
- **Support**: verified content-complete and structurally matching (popular topics / support
  categories / support articles / need-more-help / message-a-coach). Support-categories icon-cards
  (source shows large icon illustrations per category) accepted as a simplified link-list — noted,
  not fixed, given scope.

### T19 — DA sync bug discovery: markdown round-trip strips non-block classes ⚠️→✅
**Root-caused a class of latent bugs**, found while syncing T18's fixes to DA: the DA content
pipeline's HTML→markdown→HTML round-trip **only preserves the top-level class of a div that is a
recognized block** (e.g. `class="feature-panel blue"` survives because `feature-panel` is a block
name). Any class added to a plain `<p>`/inner `<div>` for one-off styling — e.g. `class="eyebrow"`
on a paragraph, or a bespoke `class="footer-acknowledgement"` wrapper — is **silently stripped** on
DA even though it renders correctly on the local `--html-folder drafts` server (raw HTML, no
stripping). This is invisible in local dev and only surfaces once content is uploaded to DA.
- **Fix pattern established:** target such elements **structurally** (`:first-child`, `:nth-child`,
  `:has()`, element type) based on DOM position, which is identical between local drafts and DA
  output, instead of adding new arbitrary classes. Applied to the footer acknowledgement card and
  the accounts-cards eyebrow.
- **Also caught a real regression**: the pill-nav centering fix (T18) over-applied to pages that
  combine a hero (heading+copy+image) with an in-page pill-nav in the *same* section (Support),
  forcing the whole hero to center-collapse. Scoped the rule to exclude sections containing an image.
- Verified the fix by checking the **DA-served** `.plain.html` (not just local drafts) for the
  expected structure/classes post-upload — this is now the standard verification step for anything
  touching non-block classes.

### T20 — Full sub-page fidelity + sync sweep: 21 remaining pages (4 parallel agents) ✅
Dispatched 4 parallel agents across disjoint page sets to fidelity-check and DA-sync every
remaining migrated page against its live source, carrying the T19 class-stripping lesson forward.
- **Pages covered (21):** my-accounts, everyday-transaction, transact, save, flex-saver,
  growth-saver, joint-bank-accounts, new-to-australia, explore-loans, refinance-calculator,
  eligibility, interest-fees, support-home-loans, add-ons, coaches, switch-to-plus, download,
  security, feedback-complaints, privacy, terms-conditions.
- **Most pages (13) already matched source** from the T14 bulk migration — confirmed via
  source-vs-draft heading/structure diff, no changes needed.
- **Real fixes found and shipped:**
  - `everyday-transaction`/`transact`: promo pair was stacking full-width instead of source's 2-col
    grid — used the existing `panel.duo` modifier (no new code).
  - `panel` block: the sub-banner eyebrow label used the T19-class-stripping-prone `.eyebrow` class
    — fixed structurally (`p:first-child`), repairing the same latent bug on 6 pages at once
    (index/coaches/accounts/everyday-transaction/security/transact) without touching their markup.
  - `save`: a literal `<table>` for the account comparison — DA's pipeline interprets a page-level
    `<table>` using the **EDS block-table convention** (first row consumed as the block name),
    corrupting it. Built a minimal `table` block instead.
  - **`refinance-calculator`** (hls-calculator): authored with `<dl>`/`<dt>`/`<dd>` and extra
    wrapper `<div>`s — DA's round-trip converted the `<dl>` to a flat `<ul><li><p><p></li></ul>`
    and **stripped every class and wrapper div**, degrading the live calculator to unstyled
    paragraphs. Rewrote the block's markup/CSS to use only structurally-targetable elements.
  - **`eligibility`** (hls-link-list): authored with only 1 wrapper div instead of the required
    2-level block/row/**cell** nesting every other working block uses — DA couldn't recognize it as
    a block and dropped the class + wrapper, degrading it to a bare bullet list. Added the missing
    cell div.
  - **`interest-fees`** — most serious: a literal `<table>` inside a `notice` callout hit the same
    block-table convention as `save`, which **silently deleted the first fee row** ("Overseas
    transactions: 3%…") on every DA upload. Replaced with a `<ul>` label/value list and added
    scoped `notice` CSS (`li:has(p + p)`) for the fee-row pattern.
- **Verification:** every fix independently re-verified post-sync — confirmed the previously-deleted
  interest-fees row is present on the live DA preview, the eligibility link-list and the refinance
  calculator both render with full classes/structure intact. Broken-image checks across all 25
  content pages via direct HTTP status on every `<img>` src (not browser `.complete`, which produces
  false positives from `loading="lazy"` + headless/programmatic scroll) — **0 real broken images**
  site-wide. All 25 slugs HTTP 200 on the DA preview host.
- Central `npm run lint` pass after merging all 4 agents' work: clean (waived
  `no-descending-specificity` file-scoped on 3 more structurally-grouped block CSS files, consistent
  with the existing header/footer/feature-panel convention).
- Commits: `b8c29ca`, `9bbb617`, `b1373d8`, `ac93f58`, `360cd99`, `5e4320a`, `8a832c0`.

### T21 — User-prompted spot-check found the `notice` block silently broken on 5 pages ✅
User asked to diff `localhost:3000` (root, proxies the **remote DA preview**) against
`localhost:3000/drafts/index` (local draft, bypasses DA entirely) — this surfaced a bug that all
prior screenshot-based verification had missed, because the page still looked plausible at a
glance (image gone, but heading/copy still flowed in the right place as unstyled text).
- **Root cause (a new instance of the T19/T20 class of bug):** every `notice` block usage authored
  with a row's content **directly inside the row `<div>`** (no separate cell `<div>`) — e.g.
  `<div class="notice pill"><div><picture>…</picture></div>…</div>` instead of
  `<div class="notice pill"><div><div><picture>…</picture></div></div>…</div>` — loses its block
  class entirely on DA's markdown round-trip, even when every other aspect of the authored HTML is
  otherwise correct. Confirmed structurally: every WORKING block on the site (`hero`, `iconnav`,
  `panel`, `cards`, `feature-panel`, …) has row→**cell**→content (2 levels of div under the block
  class); the broken `notice` instances had row→content directly (1 level) for at least one row,
  and DA drops the block's identity if *any* row is one level too shallow.
- **Confirmed via a controlled test**, not just theory: added the missing cell `<div>` to
  `index.html`'s `notice pill`/`notice center`, re-uploaded, and the class + image round-tripped
  correctly — then reverted and reconfirmed the break, isolating this as the deterministic cause
  (re-uploading the *unfixed* file twice reproduced the identical failure both times — this is
  a structural defect in the authored markup, not a transient DA hiccup).
- **Affected pages, all fixed the same way:**
  - `index` — "Add-Ons" pill (lost its icon image) and "Smarter banking. Made simple." (lost its
    white centered card treatment entirely, rendering as plain unstyled text).
  - `accounts` — "The starter pack" band and "We're here to help" (lost the tinted/rounded panel
    treatment; the coach photo still rendered but as a bare inline image, no card).
  - `everyday-transaction` / `transact` — the same missing-cell-wrapper bug on their `notice`
    fees panel, **compounded by the T20-class `<table>` bug** (a literal `<table>` for the 3 fee
    rows, which DA's block-table convention corrupts) that hadn't been caught in T20 because these
    two pages weren't rescanned for it. Converted to the same `<ul>` label/value list pattern used
    for `interest-fees`.
  - `joint-bank-accounts` — "Things you should know" notice lost its panel styling.
- **Not affected (checked directly on DA, not assumed):** `feature-panel` (11/11 instances),
  `feature-cards` (5/5 on benefits), `rate-card`, `tick-list`, `faq`, `pill-nav`,
  `acct-rate-cards`, `hls-band`, `util-link-cards`, `cards` — all confirmed with proper row→cell
  nesting and 1:1 class survival between `deploy/*.html` and the DA-served `.plain.html`.
- **No code change required** — this was purely a content-authoring structure fix (extra wrapping
  `<div>` per row) in `drafts/*.plain.html` + `deploy/*.html`; `notice.css`/`notice.js` already
  worked via descendant selectors that don't care about the extra nesting depth.
- Re-verified all 5 fixed pages: `notice` class present on DA post-upload, the interest-fees-style
  fee row ("Overseas transactions") intact on both everyday-transaction and transact, 0 broken
  images locally, all 25 site pages still HTTP 200.
- **New standing verification practice:** when authoring any block usage, every row must nest its
  content one level deeper than the row `<div>` itself (row → cell → content), even for
  single-child rows — this is now the checklist item to catch before upload, not after.

### T22 — User-prompted 2K fidelity sweep found two ultra-wide layout bugs ✅
User asked for a hero-block diff between `localhost:3000/` and `anz.com.au/plus`, then a broader
benefits-page fidelity check, both explicitly **at 2K (2560px) viewport** — a width no prior
session pass had tested (all earlier fidelity work used 1440px). Found and fixed two real,
viewport-dependent bugs invisible at normal desktop widths:
- **Hero (homepage + shared across pages):** measured source precisely at 1440/1920/2560px —
  its hero is a **fixed 640px height**, capped at **max-width 1920px** (centered beyond that,
  matching my earlier T18 assumption of ~480px was wrong), and its text sits inset ~10% of hero
  width from the edge (via the source's own grid container), not flush against a small fixed
  padding. Fixed `hero.css`: `max-width:1920px; margin:0 auto`, `min-height:640px`, and
  horizontal padding derived from *our own* 1200px content-width convention —
  `max(32px, calc((min(100vw, 1920px) - 1200px) / 2))` — clamped so it never exceeds what the
  1920px-capped hero can actually render (avoids blindly using `50vw`, which would overshoot
  once the hero itself stops growing at the cap).
- **`feature-panel.blue/navy/sky` and `rate-card` (benefits + every page using these full-bleed
  colour panels):** both set `width: 100vw` and add horizontal padding **without
  `box-sizing: border-box`** — so the padding was added *on top of* the 100vw width instead of
  being absorbed within it. At 2560px viewport this inflated the actual rendered panel to
  **4080px** (2560 + 2×760px padding), causing genuine **page-wide horizontal overflow**
  (`scrollWidth` 4080 vs `clientWidth` 2560) and, because the flex-child image/QR columns compute
  their width from that oversized box, a 600×831px phone-mockup image and a 600×600px QR code
  were both **upscaled ~2.1x past their native resolution** (1248px rendered), ballooning two
  panel sections to 1900px+ tall and visually bleeding into the next section. Fixed by adding
  `box-sizing: border-box` to both blocks — confirmed on re-check: zero horizontal overflow,
  images render near-native size (488×676 / 488×488), and total benefits-page height dropped
  from 11,026px to 9,213px.
- Both fixes verified locally, then on the live DA preview at 1440/1920/2560px, confirming normal
  desktop/tablet/mobile widths (all ≤1920px, unaffected by the max-width caps) render identically
  to before — these were purely ultra-wide-viewport regressions.
- **New standing check:** any block using the `width: 100vw; margin-left: calc(50% - 50vw)`
  full-bleed breakout pattern **must** also declare `box-sizing: border-box`, or padding silently
  inflates the box past the viewport. Grepped the whole `blocks/` tree for this pattern to confirm
  only `feature-panel` and `rate-card` used it (other full-bleed sections — `usps`, `panel`,
  `appjoin` — color the section wrapper directly instead, which doesn't have this failure mode).
- Commits: `946abf1`, `eae48c1`.

### T23 — Information architecture restructure: flat → nested hierarchy matching source ✅
User flagged that the migrated site was entirely flat (every page at the DA root) while source
`anz.com.au/plus/` has a real folder hierarchy (e.g. `/plus/accounts/everyday-transaction/`,
`/plus/support/home-loans/eligibility/eligibility-requirements/`). Verified the exact source
hierarchy with targeted `curl` probes (not assumed) before moving anything, then moved every
child page under its correct parent landing page, keeping existing local slugs unchanged
(this was a **nesting-level fix**, not a slug-renaming exercise) except `support-home-loans` →
`support/home-loans` (renamed on nesting, since the flat name existed only to avoid colliding
with the top-level `/home-loans` landing — nesting removes that collision).
- **14 pages moved:**
  - Under `/accounts/`: `everyday-transaction`, `transact`, `save`, `flex-saver`, `growth-saver`,
    `joint-bank-accounts`.
  - Under `/benefits/`: `add-ons`, `my-accounts`, `security`.
  - Under `/home-loans/`: `explore-loans`, `refinance-calculator`.
  - Under `/support/`: `feedback-complaints`, `home-loans` (was `support-home-loans`).
  - Under `/support/home-loans/`: `eligibility` (3 levels deep, matching source's
    `support/home-loans/eligibility/eligibility-requirements` — the "eligibility" segment alone
    isn't an independent page in source, it 404s/redirects to the home-loans landing, confirmed
    by probing `/plus/support/home-loans/eligibility/` directly).
- **12 pages confirmed flat in source, left at root:** `accounts`, `benefits`, `home-loans`,
  `support` (the 4 landing pages), `new-to-australia`, `interest-fees`, `coaches`,
  `switch-to-plus`, `download`, `privacy`, `terms-conditions` — each verified individually via
  `curl` against the live source rather than assumed from nav groupings (nav's conceptual
  "Support"/"Why Plus" groupings do **not** always match the actual URL hierarchy).
- **Execution:** moved `drafts/<slug>.plain.html` + `deploy/<slug>.html` into matching
  subdirectories (confirmed a file `support/home-loans.html` and a nested folder
  `support/home-loans/eligibility.html` coexist fine — files and folders of the same base name
  don't collide, in the local filesystem, in DA's source storage, or in the aem-cli dev server's
  path resolution — verified all three). Then a single sed pass rewrote every local-relative
  `href="/<old-slug>"` to its new nested path across **all** `drafts/*.plain.html`,
  `deploy/*.html`, and the root `nav.plain.html`/`footer.plain.html` — 58 files touched, using
  exact quote-delimited string matching (no fragment/anchor variants existed, confirmed by a
  pre-check) so there was no risk of partial-path collisions between old slugs.
- **DA sync:** uploaded all 14 pages to their new nested DA paths (201 Created + 200 preview each),
  uploaded the updated `nav`/`footer`, then deleted the 14 old flat DA source docs (204) **and**
  their cached preview entries via the Admin API's preview-delete endpoint (204) — source deletion
  alone doesn't retire an already-generated preview; both were needed for the old flat paths to
  actually start 404ing instead of serving stale content.
- **Caught a real gap during verification, not before:** a site-wide link-integrity sweep (fetch
  every page's `.plain.html`, extract every local `href`, HTTP-check each one) found 2 stray
  broken links on `new-to-australia` and `switch-to-plus` — these pages weren't among the 14
  moved, but their **body content** cross-linked to pages that moved (`/security`,
  `/joint-bank-accounts`, `/my-accounts`), and the sed pass had correctly fixed those links
  locally, but they were never re-uploaded since the sync loop only covered the 14 moved pages
  + nav/footer, not every OTHER page whose links happened to change. Found and fixed by diffing
  "every deploy file containing a new nested href" against "every file already re-uploaded" — the
  2-file delta. Re-uploaded both; re-ran the full sweep — **0 issues across all 26 pages**.
- **Verification:** all 26 pages HTTP 200 (local + DA preview); all 14 old flat paths now 404 on
  DA preview; a full site-wide crawl of every page's every local link — 0 broken links; broken-image
  HTTP-status check across all 14 moved pages — 0 broken; mega-menu's rendered `<a href>`s on the
  live homepage spot-checked and confirmed pointing at the new nested paths; `npm run lint` clean
  (no code files touched — this was a pure content/path restructure).
- **Not done (explicitly out of scope for this pass, tracked below):** `redirects.json` for the
  14 retired flat paths. The project isn't published to `.aem.live` yet (nothing external can be
  pointing at the old preview URLs), and DA's sheet-authoring format for `/redirects` wasn't
  validated in this session — attempting it blind risked shipping a malformed redirects doc.
  Tracked as a pending item to do properly (author as a real DA sheet, not guessed JSON) before
  the first live publish.

## 8. Current status

- **On `main` (code):** the full block library (24 blocks incl. `table`) + measured tokens +
  all fidelity fixes + the DA class-stripping structural-selector pattern + the T22 hero/full-bleed
  viewport fixes. Latest commit `411428c`.
- **On DA preview (content):** the **entire 26-page site** now with a **proper nested hierarchy**
  matching source (`/accounts/*`, `/benefits/*`, `/home-loans/*`, `/support/*` children under
  their landing pages; 12 pages confirmed genuinely flat in source stay at root) + nav/footer —
  all previewing at `aem.page`; every slug HTTP 200, verified 0 broken images and 0 broken
  internal links via a full site-wide crawl (T23). Footer acknowledgement art + QR PNGs live
  under DA `/media`.
- **Nav/footer:** mega-menu and footer links point at the new nested local paths matching
  source's information architecture; footer includes the acknowledgement-of-country card and the
  "ANZ Plus Credit Guide" link.
- **Fidelity status:** every page has been individually compared against its live source at least
  once (T18 for the 5 primary nav pages, T14+T20 for the 21 sub-pages). Six genuine content/layout
  bugs found and fixed across T20-T22, plus a full IA restructure (T23) correcting every page's
  URL depth to match source and fixing 2 stray cross-links surfaced only by a full-site crawl.
- **On live:** nothing published — **gated on user review**.

## 9. Pending / next

- [ ] Fold `import-work/DEFERRED-shared-changes.md` token suggestions into `:root`.
- [ ] Author `redirects.json` as a proper DA sheet for the 14 retired flat paths (T23), before
  first live publish — not urgent since nothing is published/external yet.
- [ ] User review → publish to live.
- [ ] Optional polish (accepted-as-is, lower priority): Support's "support categories" section uses
  a link-list where source shows large icon-illustration cards; interactive tools (refinance
  calculator live results, rate toggle, eligibility flow) remain faithful static-default states.

---

*Last updated: 2026-08-07 (through T23: restructured the flat site into a nested hierarchy matching
source's information architecture — 14 pages moved under their correct parent landing pages,
mega-menu/footer/cross-links updated and verified via a full site-wide link crawl (0 issues across
26 pages); live publish pending user review).*

