# Design

## Overview

This is a small public directory for ten forthcoming onchain art projects. The brief asks for “super minimalist” and “almost no styling.” The implemented visual idea is a plain document: serif text, underlined browser-style links and ten numbered rows. The project description, constraints and navigation lead directly into the list.

The sources of truth are `src/style.css`, `src/App.tsx`, `src/projects.ts` and the metadata in `index.html`. There is no component library, font service, client JavaScript or wallet UI. React generates static HTML during the Vite build.

## Colors

All semantic tokens are declared in `src/style.css:1`. The single theme is light.

| Token | Value | Role |
| --- | --- | --- |
| `--color-page` | `#ffffff` | Document background |
| `--color-text` | `#111111` | Title, headings, rules, row numbers |
| `--color-secondary` | `#595959` | Upcoming text, launch count, update note, footer |
| `--color-link` | `#0000ee` | Underlined unvisited links |
| `--color-visited` | `#551a8b` | Browser visited-link state |
| `--color-rule` | `#dddddd` | Decorative separators between project rows |

The focus ring uses the element’s `currentColor`, with a 2px solid outline and 4px offset. Forced-colors mode retains the browser’s system color mapping. Link underlines distinguish actions without relying on color, and “Upcoming” is a written status.

The production probe measured text against its resolved white background and passed all contrast checks. Token calculations give 18.88:1 for primary text, 7.00:1 for secondary text, 9.40:1 for unvisited links and 11.01:1 for the declared visited-link color, all on white. The visited value is a token calculation, not a rendered history-state observation. Dividers carry no information that depends on contrast.

## Typography

`src/style.css` uses `"Times New Roman", Times, serif` everywhere, with platform fonts and no font downloads. The browser reported that requested family; the precise fallback font can vary by platform.

| Role/token | Size at default settings | Weight | Line height |
| --- | --- | --- | --- |
| Body / `--text-body` | `1rem` / 16px | 400 | 1.5 |
| Section / `--text-section` | `1.25rem` / 20px | 700 | 1.3 |
| Title / `--text-title` | `2rem` / 32px | 700 | 1.15 |

Only three sizes and two weights are used. Letter spacing is natural. The title uses `text-wrap: balance`; paragraphs use `text-wrap: pretty`, with ordinary wrapping as the browser fallback. Numbers and the computed launch count use tabular numerals. Links and future project text may break long strings; no text is truncated or clipped. Underlines have a `0.12em` offset. Text remains selectable and sizes use rem units.

## Layout

The `main` element in `src/style.css:26` is the layout primitive: maximum outer width 42rem (672px at the default setting), centered, with 1.25rem horizontal padding. Its default vertical padding is 3rem. At widths up to 30rem (480px) vertical padding becomes 2rem. The structure stays a single column at every width.

Spacing uses multiples of 0.25rem: 0.25rem between rule items and between a future live name and description; 0.5rem between the intro and byline; 1rem for introductory/section spacing; 1.5rem before the rules; 2rem between major groups and before the footer. Project rows have 0.625rem vertical padding, making the short upcoming rows approximately 45px tall including their divider.

`.section-heading` aligns “Projects” and the count to shared baselines, wrapping naturally if space runs out. `.project` is a two-column grid: 2.5rem for its number, a 0.5rem gap, and `minmax(0, 1fr)` for content. Row heights grow with text. Logical margins/padding are used for directional spacing. No fixed or sticky content covers the document.

Rendered checks covered 320, 390, 768 and 1440 CSS pixels. At 390×844 the title, Twitter link, project-jump action and multiple slots are visible without scrolling. The 320px title wraps into two lines. At 200% CSS text enlargement the count moves onto its own line and the document grows vertically without horizontal overflow. That test is not native browser zoom.

## Elevation & Depth

The surface system is flat white. The only structural lines are 1px separators after each project. There are no shadows, overlays, cards or visual depth effects.

## Shapes

There are no rounded surfaces, pills or ornamental frames. The sole rectangular outline is keyboard focus. No container uses `overflow: hidden` or crops content.

## Components

| Pattern | Source | Behavior |
| --- | --- | --- |
| Intro and author | `src/App.tsx:25` | One h1, one-line description where space allows, native Twitter link in the same tab |
| Constraint list | `src/App.tsx:31` | Semantic unordered list; static, with a descriptive accessible label |
| Project jump | `src/App.tsx:37` | Native `#projects` link, 44px tall at default size; Enter/click navigates and focuses the h2 target with `tabIndex={-1}` |
| Section heading/count | `src/App.tsx:39` | One h2 and a count calculated from the project data; flex wrapping |
| `ProjectRow` | `src/App.tsx:3` | Accepts a `Project`; static upcoming text, or a live name, description and “Play on Etherscan” link |
| Project data | `src/projects.ts:1` | Discriminated union requiring real launch details for a live slot; all ten delivered slots are upcoming |
| Footer | `src/App.tsx:50` | One quiet question describing the experiment |

Links retain native hover, active, visited, keyboard and browser Back behavior. `:focus-visible` adds a clear outline. Decorative arrow characters are hidden from the accessible name. The numbered `<ol>` explicitly retains `role="list"` when its native visual markers are removed. There are no loading, pending, success, error, modal or form states because there is no runtime service or transaction flow. The upcoming state is permanent static content until an editor supplies launch details and rebuilds.

`public/favicon.svg` is the simple “10” tab icon. `public/social.png` is the share card generated from `assets/social-card.svg`; neither asset is a page illustration.

## Do’s and Don’ts

- Reuse `main`, the three type sizes, native links and the existing project-row pattern.
- Keep exactly ten numbered slots, add only confirmed launch details, and rebuild `dist/` after updates.
- Keep project interaction on Etherscan; the website is an index, with no wallet or contract controls.
- Keep link underlines and visible keyboard focus. Let long content wrap and rows grow.
- Keep the palette and flat document appearance; additions such as decorative heroes, animations, cards or remote fonts would depart from this brief.

If a later page is requested, begin with the same `main` measure, one h1 and plain native links, use the existing semantic tokens, and export it explicitly or use fragment navigation for static hosting. No additional page is currently implemented.

Design and documentation references, licenses and attribution are preserved in `docs/design-guidance-NOTICE.md` and `docs/design-guidance-LICENSE.txt`. Review evidence and unperformed checks are recorded in `VALIDATION.md`.
