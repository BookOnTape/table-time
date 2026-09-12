# Table Time

A phone-and-tablet web app of activities for a toddler at a restaurant table. Kid-facing screens must work for a 5-year-old with no reading required; parents get a passcode-gated settings screen. The owner cares about design quality: the app should teach good taste, not just keep a child busy.

## Commands

```sh
npm run dev        # Vite dev server, http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # serve dist/ on :4173
```

Node 22 via nvm on JoeCool (`. ~/.nvm/nvm.sh` if `node` is missing in a fresh shell). Static output; GitHub Pages deploy runs on push to `main`.

## Verify before pushing

1. `npm run build` must pass (it runs `tsc -b` first).
2. Render the screens you touched in headless Chromium at 390px wide and look at the PNGs. Playwright is the tool; a script that walks every route and screenshots it lives in the session scratchpad and is easy to recreate. Do not push a visual change you have not looked at.
3. Test interactions, not just first paint: tap a coloring region, flip two memory cards, enter a wrong passcode.

## Design system

Read this before touching any CSS or adding a screen.

**Identity: a paper placemat with a crayon box, under Liquid Glass chrome.**

- **Ground:** paper (`--paper`), never grey or pure white for page backgrounds. A soft ambient wash of the crayon colors sits behind the paper (`body::before`) so glass has something to refract.
- **Ink:** `--ink` for text and outlines. Secondary text uses `--ink-2`, tertiary `--ink-3`.
- **Crayons:** six accents only: `--tomato`, `--marigold`, `--leaf`, `--cobalt`, `--plum`, `--bubblegum` (plus `--sky` for water/air). Every activity and section owns one. Do not introduce new hues.
- **Type:** Bricolage Grotesque for display (headings, tile titles, readouts, buttons), DM Sans for UI text. Both are self-hosted from npm; never load fonts from a CDN. Set `font-variation-settings: "opsz"` on display text.
- **Icons:** one custom set in `src/components/Icon.tsx`, 24-unit grid, 2.4 stroke, round joins. No emoji anywhere in the UI. Add new glyphs to that file.
- **Glass (`.glass` in `src/styles/base.css`):** for the controls layer only: back button, title capsule, segmented switch, keypad, settings groups, celebration card. Never put content on glass (coloring sheets, canvases, boards stay opaque white via `.sheet`). Never stack glass on glass.
- **Radii:** `--radius-sm` 14, `--radius` 24, `--radius-lg` 32, `--pill`. Nested elements use a smaller radius than their parent so corners stay concentric.
- **Touch targets:** 44px minimum on anything a child taps, 56px preferred for primary actions.
- **Motion:** springs via `--spring`, ease-outs via `--out`; entrance is `.rise`, press feedback is `.press`. Honor `prefers-reduced-motion` (already global).

Tokens: `src/styles/tokens.css`. Base styles and utilities: `src/styles/base.css`.

## Components to reuse

Build new activities from these rather than inventing controls:

- `ActivityChrome` (toolbar + full-height stage), `Readout` (score/progress)
- `Segmented` (mode switch with sliding glass thumb)
- `Crayon` / `CrayonCup` (color picker styled as crayons in a cup)
- `Celebrate` (end-of-round card with an icon badge)
- `TopBar`, `Tile`, `TileGrid`, `Carousel`, `PinPad`, `Switch`, `Icon`

## Adding an activity

1. `src/activities/<id>/index.tsx` with a default-exported component taking `ActivityProps`.
2. Register it in `src/activities/registry.ts`: id, title, icon, blurb, accent, ages, section, lazy `load`.
3. An activity that is a library of pages (coloring scenes) declares `variants` and `flattenVariants: true`. Scene data format is in `src/activities/color-by-number/scenes.ts`.

Everything else (home shelves, section grids, settings toggles, routing) derives from the registry.

## Design skills

The full `wondelai/skills` catalog (65 skills) is installed at the user level on JoeCool in `~/.claude/skills/`, so every one of them is available in every session there. Cloud sessions do not see them unless a skill is copied into this repo's `.claude/skills/`. Guidance for this project:

- **Use:** `refactoring-ui`, `web-typography`, `microinteractions`, `ux-heuristics`, `design-everyday-things`, `steve-jobs-design-review`.
- **Use with care:** `ios-hig-design`. It is written for SwiftUI and predates Liquid Glass. Take its rules on safe areas, 44pt targets, Dynamic Type, and contrast. Ignore its pushes toward SF Symbols and system controls; this is a web app with its own icon set.
- **Do not apply:** `hooked-ux`, `improve-retention`, `top-design`. Habit loops and engagement mechanics are inappropriate for a toddler app, and Awwwards-style scroll theatre fights the calm the app needs.

## Conventions

- Feature branches named `claude/<topic>-<id>`, PRs against `main`, draft first.
- Commit messages: imperative subject, body explains the why.
- No emoji in UI, commit messages, or PR bodies.
- Everything persists to `localStorage` under the `tabletime:` prefix through `src/lib/storage.ts`. Nothing is sent anywhere.
