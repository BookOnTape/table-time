# Table Time

A phone-and-tablet web app full of things a toddler can do at a restaurant table: color-by-number scenes, a doodle pad, bubble popping, memory match, and tic-tac-toe. Parents get a passcode-protected settings screen.

## Run it

```sh
npm install
npm run dev        # http://localhost:5173
npm run build      # static output in dist/
npm run preview    # serve the production build
```

The app is a static site. Any host works. The included GitHub Actions workflow deploys `dist/` to GitHub Pages on every push to `main`; turn on Pages with the "GitHub Actions" source in the repo settings to activate it.

Add it to a phone home screen from Safari or Chrome and it opens full-screen like a native app.

## Parent settings

Tap the gear on the home screen. The default passcode is `1234`; change it under Security. Settings let you set the kid's name, mute sound effects, hide individual activities, and wipe saved progress. Everything lives in the browser's local storage on that device.

## Adding an activity

1. Create `src/activities/<id>/index.tsx` with a default-exported React component that accepts `ActivityProps`.
2. Register it in `src/activities/registry.ts` with a title, emoji, accent color, section, and lazy `load`.

That is the whole job. The home grid, section pages, settings toggles, and routing all read from the registry. Wrap the component in `ActivityChrome` to get the standard toolbar and full-height stage.

An activity that is really a library of pages (coloring scenes, mazes) declares `variants` and sets `flattenVariants: true` so each page gets its own tile in the section grid. See `src/activities/color-by-number/scenes.ts` for the scene format; scenes are plain data built from `rect`, `circle`, `ellipse`, and `poly` helpers.

Add a section by appending to `sections` in the same registry file.

## Design system

The look is a paper placemat with a crayon box under Liquid Glass chrome: paper ground with a soft ambient color wash, ink outlines, six saturated crayon colors, a single custom icon set (no emoji), and translucent glass controls that blur whatever scrolls beneath them (`.glass` in `src/styles/base.css`). Display type is Bricolage Grotesque, UI type is DM Sans; both are bundled from npm so the app looks the same offline. Tokens live in `src/styles/tokens.css`; icons in `src/components/Icon.tsx`. New activities should use `ActivityChrome`, `Segmented`, `Readout`, `Crayon`, and `Celebrate` rather than inventing controls.

## Layout

```
src/
  activities/      one folder per activity, plus registry.ts and types.ts
  components/      TopBar, Tile, TileGrid, Carousel, PinPad, Switch, ActivityChrome
  lib/             settings context, passcode hashing, local storage, sound
  pages/           Home, SectionPage, PlayPage, SettingsPage
  styles/          design tokens and base styles
```
