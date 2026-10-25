# Validation record

Complete for the stated scope. These are worker-run checks, not independent certification.

## Scope and assumptions

One plain static page, ten future launch slots, a project-section jump, and the supplied creator’s Twitter profile. No project names, dates, addresses or ABIs were provided, so all slots are honestly upcoming and have no play link. “No UIs” is implemented as no project interaction UI: visitors will play through the real Etherscan links when launches are supplied. A wallet integration, launch feed, subscription form and backend are outside this brief.

The visual idea is a plain serif document with browser-style links and a numbered index. The explicit request for “almost no styling” takes precedence over decorative marketing patterns. No repeated navigation precedes main content, so a skip link is not needed.

## Requirement review

| Requirement | Status | Evidence |
| --- | --- | --- |
| “super minimalist website with almost no styling” | Met | Plain serif text, white background, native links, single column; actual phone/desktop screenshots reviewed |
| “upcoming 10 minimal onchain projects” | Met | Ten numbered upcoming slots; count is 0 / 10 launched |
| “no tokens (nft or erc20)” | Met as project rules | `src/App.tsx:32`; no contracts are part of this task |
| “no pausable or owner owned functions” | Met as project rules | `src/App.tsx:33` |
| “no uis, only playable via etherscan” | Met as project rules and index design | `src/App.tsx:34`; future live rows point to Etherscan; no wallet code |
| “art project to try to create demand” without upside incentives | Met | Intro and footer describe the experiment without promising an outcome |
| “@surfcoderepeat on twitter (link to twitter)” | Met | Native link to `https://twitter.com/surfcoderepeat`; destination tested by intercepted navigation |
| “update the site with the projects as we launch them” | Met | Typed editable data in `src/projects.ts`; live rendering branch; rebuild instructions |
| Usable responsive page and primary interactions | Met | 15 interaction checks passed, plus rendered inspection at four widths |
| Static `dist/index.html`, assets, source and lockfile | Met | Four-file complete export, relative URLs, package-lock.json; `dist/` is not ignored |
| Production build, typecheck and honest results | Met | Commands and results below and in README |
| Better Interface six-domain review | Met | Coverage table below; no unresolved applicable defects |
| Product and main action on first screen at 390 | Met | 390×844 screenshot and bounding-box assertions for title, jump link and first project |
| Title, favicon, description, og:title, og:image | Met | `index.html:6`; actual icon/image loaded at gateway subpath |
| Root `DESIGN.md`, install/preview/rebuild README | Met | Documents describe the final implemented source |

No required feature is represented by fabricated data. Actual launches need the requester’s later project details; this is an expected content update, not a blocked website build. Hosting occurs after delivery.

## Six-domain coverage

| Domain | Status | Checks and evidence | Limits / not applicable |
| --- | --- | --- | --- |
| Accessibility | Checked | Native links; one main/h1 and h2 target; semantic lists; keyboard Tab/Enter and visible rings inspected in screenshots; axe 4.14.0: zero violations and 22 passed WCAG A/AA rules; forced-colors screenshot; text reflow | No screen-reader, physical-device or native-zoom session; forms, dialogs and dynamic announcements are not applicable |
| Layout | Checked | Rendered 320, 390, 768, 1440; no horizontal overflow or text overlap; product/action on first phone screen; long-copy stress; 200% CSS text enlargement; flow follows source order | No RTL/localization support is advertised; no RTL mirror or browser-native zoom test |
| Writing | Checked | Heading has three words; intro says what this is; visible constraints match the brief; links name their destination; upcoming state says updates follow launches; no invented dates or live claims | Future descriptions and Etherscan URLs must be reviewed when supplied |
| Typography | Checked | Computed scale 16/20/32px; weights 400/700; one requested family; titles/paragraphs and long labels visibly wrap; no clipping or ellipsis; all screenshots reviewed | Platform serif fallback may differ; no claim of a particular installed font file |
| Colors | Checked | Probe resolved actual solid backgrounds and passed all text contrast checks; current-color focus ring viewed on white and in forced colors; links underlined and states written | Visited link’s token ratio calculated separately; browser history-state rendering and other OS contrast themes not verified; no dark theme requested |
| UI | Checked | Both native navigation interactions exercised; upcoming state inspected; no cards, shadows, custom controls, client scripts or animation; reduced-motion probe passed | Live project interaction requires real launch data; loading, transactions, overlays and animations are not applicable |

## Findings and disposition

No high, medium or low defects were reproduced in the final page; no source fix was needed after the initial rendered checks. No probe failures were suppressed.

| Location | Observation | Disposition and evidence |
| --- | --- | --- |
| `src/App.tsx:28` | Creator attribution is an inline link, smaller than the comfortable 44px target height | Advisory only. Probe’s 24px/spacing criterion passes, links do not crowd one another, and its focus ring is clearly visible. Retained to match the brief’s plain document style. |
| `src/style.css:73` | Primary project jump has an inline-block target and 0.625rem block padding | Implemented at 44px default height; click and keyboard activation passed. |
| `src/style.css:89` | Rows must tolerate future longer content | Flexible content column and growing height; 320px long-copy stress wrapped without clipping. This tests layout, not the future live branch. |
| `src/App.tsx:41` | In-page link needs a useful keyboard destination | h2 has `tabIndex={-1}` and scroll margin; Enter changed the hash and focused the heading. |

## Commands and actual outcomes

1. `npm install --cache /tmp/ten-onchain-npm-cache --no-audit --no-fund`: passed; produced the source lockfile. Dependencies were not vendored.
2. `PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node scripts/render-social.mjs /opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs`: passed; real 1200×630 PNG created and visually inspected.
3. `npm run typecheck`: passed, exit 0.
4. `npm run build`: passed, exit 0; Vite 7.3.7 emitted full static HTML and a CSS file, plus copied icon/share assets.
5. `IMD_PLAYWRIGHT=/opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline`: passed, exit 0; **16/16** checks. No missing files, page errors, overlap, clipping or horizontal scroll at 320/390/1440. Three type sizes, two weights, one family; 10 words of measured prose on the first 390px screen. Comfortable-target advisory only, no failing check.
6. `npm install --prefix test/scratch/a11y-tools --cache /tmp/ten-onchain-npm-cache --no-audit --no-fund axe-core`: passed; scratch-only audit dependency, version 4.14.0.
7. `PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node scripts/check-site.mjs /opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs test/scratch/a11y-tools/node_modules/axe-core/axe.min.js`: passed, exit 0; **15** checks. Includes keyboard and pointer jump, heading focus, Back, exact Twitter navigation, metadata assets under `/preview/`, 320/390/768/1440 reflow and first-screen assertions, 200% CSS text enlargement, long-copy stress, forced colors, no-JavaScript rendering and zero browser/resource errors. Audit: zero WCAG A/AA violations, 22 passed rules.
8. Final `npm run typecheck` and `npm run build`: passed again, exit 0. Export remained the same four files and sizes. A workspace-only Node integrity audit confirmed all required files, matching source/export PNG and SVG bytes, resolved CSS, ten complete project rows, no client scripts, no root-relative runtime paths, no dependency archives or source maps, and 23 deliverable files with total raw content below 256 KiB. The audit read no Git internals and made no changes to Git metadata.

The browser connector returned `Transport closed` at initialization and produced no managed preview. Rendered checks instead used the provided Playwright/Chromium directly, with a foreground script managing its own local server and closing it and the browser afterwards. This failure did not prevent actual rendered inspection.

Evidence generated and inspected during the run: `test/scratch/taste/shots/390.png`, `1440-full.png`; `test/scratch/interactions/{320,390,768,1440}.png`, `390-focus-creator.png`, `390-focus-projects.png`, `390-text-200.png`, `320-long-copy.png`, and `390-forced-colors.png`. The raw probe and interaction JSON live in those scratch directories. Scratch is excluded and removed before submission; screenshots are not required runtime assets and are not included in the export.

Measured/calculated contrast on white: #111111 18.88:1, #595959 7.00:1, #0000ee 9.40:1; declared visited #551a8b 11.01:1. The first three are present in the rendered probe; the visited state is a token calculation only.

## Export and limits

The export is 47,292 bytes: `index.html` 3,525; CSS 1,832; `social.png` 41,687; `favicon.svg` 248. There are no JS bundles, source maps, archives, remote fonts or remote runtime assets. Source, lockfile, docs and local assets are preserved. The entire deliverable’s raw file content is below 256 KiB, leaving ample space within 8 MiB. `.gitignore` has an explicit 256-byte budget, uses 111 bytes, and excludes only dependency directories and disposable scratch.

Unperformed: WebKit/Safari, actual screen readers, physical devices and native browser zoom. Twitter navigation was intercepted to verify its destination without asserting external service uptime. No live Etherscan gameplay can be checked before launches exist. The future `live` branch is documented and typechecked but has not been validated with real launch content. Social metadata and the image resolve locally; no hosted social crawler test was performed. No claim is made about future contracts’ safety or adherence to the stated art constraints.
