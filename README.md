# Ten onchain projects

A deliberately plain index for @surfcoderepeat’s ten upcoming onchain art projects. The page states the constraints, lists ten launch slots, and links to [@surfcoderepeat on Twitter](https://twitter.com/surfcoderepeat).

All ten slots are **Upcoming** because no project names, contracts or launch dates were supplied. There are no invented launches, project interfaces, wallet controls or transactions on this site.

## Install, run and rebuild

Use Node.js 22 and npm. The lockfile is included.

```sh
npm ci
npm run dev
```

Vite prints the local development URL. For a production preview:

```sh
npm run typecheck
npm run build
npm run preview
```

Preview serves the finished `dist/`. Deliver that entire directory, including `dist/assets/`, `favicon.svg` and `social.png`. Vite uses `base: './'`; runtime assets are local and relative, and navigation uses a fragment. The export works under a gateway subpath and needs no server rewrites.

React and TypeScript generate the document at build time through `vite.config.ts`. The production page contains the full HTML and CSS with **no client JavaScript**. Links and content work with JavaScript disabled. Installation needs the npm registry; the build itself makes no network requests. No backend, environment variables or credentials are needed.

## Add a launch

Edit the corresponding entry in `src/projects.ts`, keeping its number and the list’s order. Change its status from `upcoming` to `live`, then add the real `name`, a short `description`, and `etherscanUrl` pointing to the deployed contract’s verified Etherscan interaction page. The `Project` union in that file defines the required fields.

Use only confirmed project details and the actual Etherscan URL. The launched count is computed from the entries. A live entry renders its name, description and “Play on Etherscan” link; upcoming entries remain plain text. Re-run the typecheck, build and interaction checks after editing. Updates require a new export; this page has no automatic launch feed or CMS.

`src/App.tsx` contains the copy and list rendering. `src/style.css` contains the small set of style rules. `index.html` contains the page metadata. `DESIGN.md` records the final design.

## Validation performed

- `npm run typecheck`: passed.
- `npm run build`: passed; four production files, 47,292 bytes total, including the share image.
- Pinned `taste@1` probe: **16/16 checks passed**, including render, overflow, target spacing, contrast and metadata.
- Chromium interaction checks: **15 passed**, including native keyboard focus and fragment navigation, browser Back, exact Twitter destination, relative assets at `/preview/`, JavaScript disabled, long-copy reflow and 200% CSS text enlargement.
- axe-core 4.14.0: zero WCAG A/AA violations; 22 rules passed. This is an automated scan, not an accessibility certification.
- Actual screenshots inspected at 320, 390, 768 and 1440 CSS pixels, plus focused links, forced colors, enlarged text and the 1200 × 630 share card. No console errors or failed resources were observed.

The interaction checker uses a separately installed Playwright module so browser packages and binaries stay out of the submission. The commands used in this assignment were:

```sh
IMD_PLAYWRIGHT=/opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline

PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node scripts/check-site.mjs /opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs test/scratch/a11y-tools/node_modules/axe-core/axe.min.js
```

The optional third argument to `check-site.mjs` enables axe; omit it for the interaction checks alone. The axe package was installed only in disposable `test/scratch/a11y-tools/`. Both checks manage their preview in a bounded foreground process. The pinned probe is an assignment input and is removed before submission; the included `scripts/check-site.mjs` remains available. Screenshots and raw test results in `test/scratch/` are disposable evidence, not runtime assets. See `VALIDATION.md` for the six-domain review, source locations and coverage limits.

Not verified: WebKit/Safari, physical phones, screen readers, native browser zoom, Twitter service availability or live Etherscan gameplay. CSS text enlargement was tested separately from native zoom. Live entries can be verified after their real launch data is supplied. The relative share-image URL resolves locally; social crawler behavior depends on the eventual hosted URL and has not been tested.

## Share assets

`public/social.png` is the finished 1200 × 630 card, copied into the export. Its editable source is `assets/social-card.svg`. Normal builds use the checked-in PNG; regenerating it is optional:

```sh
PLAYWRIGHT_BROWSERS_PATH=/opt/imd-tools/ms-playwright node scripts/render-social.mjs /opt/imd-tools/playwright-mcp/node_modules/playwright/index.mjs
npm run build
```

## Submission budget

Explicit ignore-file path budget: `.gitignore` only, at most 256 bytes, with two patterns: `**/node_modules/` and `/test/scratch/`. It does not exclude `dist/`, assets, source, the package manifest or lockfile. No package caches, npm archives, browser binaries or dependency mirrors are deliverables. The source, documentation, lockfile and export together are below 256 KiB of file content, comfortably within the 8 MiB submission limit.

## Design guidance attribution

The build applied the pinned Better Interface guide by Jakub Krehel (MIT, commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`) and documentation guidance adapted from Paul Bakaus’s Impeccable (Apache-2.0, commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`). Source links and notices are in `docs/design-guidance-NOTICE.md`; both license texts are preserved in `docs/design-guidance-LICENSE.txt`.
