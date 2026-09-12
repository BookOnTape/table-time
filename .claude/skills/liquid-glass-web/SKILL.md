---
name: liquid-glass-web
description: Apply Apple's Liquid Glass material rules (iOS 26+) to a web app built with CSS. Use when adding or restyling chrome such as bars, toolbars, floating buttons, segmented controls, sheets, or cards, when deciding whether something should be glass, or when a glass element looks wrong. Distilled from the WWDC25 design rules; the SwiftUI API parts of the source do not apply here.
---

# Liquid Glass for the web

Distilled from the design-rules section of the `liquid-glass` skill in
rshankras/claude-code-apple-skills (MIT), which itself summarizes Apple's WWDC25
sessions. Only the rules are kept; the SwiftUI, AppKit, UIKit, and WidgetKit API
material is omitted because this project is CSS.

## The one rule that decides everything

Glass is the material of the **controls layer**: bars, toolbars, floating
buttons, segmented switches, keypads, sheets, and dialogs. It is never the
material of **content**: lists, cards of content, canvases, boards, coloring
sheets, images. When unsure, ask "does the user operate this, or read it?"
Operate: glass. Read: opaque.

## Rules

| Rule | Detail |
|------|--------|
| Never glass on glass | Elements sitting on a glass surface do not get the material again. Style them with fills, ink, or vibrancy. |
| Two variants, never mixed | Regular: adaptive legibility, works over anything. Clear: only over media-rich content with a dimming layer and bold content above. One variant per interface. This project uses Regular only. |
| Tint only primary actions | When every element is tinted, nothing stands out. One tinted control per screen at most. |
| No steady-state intersections | At rest, content should not sit half under a glass element. Reposition or scale the content, or let it scroll fully under. |
| Strip decorated bars | No custom bar backgrounds, borders, or dividers. Build hierarchy with layout and grouping. Do not group an icon with a text label in one toolbar group. |
| Scroll edge effects are functional | Use a soft fade where floating controls meet scrolling content. Do not add one where nothing floats. |

## Shape system

| Shape | Radius | Use |
|-------|--------|-----|
| Fixed | Constant | Standalone elements |
| Capsule | Half the element height | Phone-scale controls; add margin from the screen edge |
| Concentric | Parent radius minus padding | Nested containers, so corners stay parallel |

## Accessibility behaviors to mirror in CSS

- `prefers-reduced-motion`: reduce lensing and springs; keep the blur.
- `prefers-contrast: more`: render glass as an opaque surface with a
  contrasting border.
- Glass adapts to what is behind it. Keep enough contrast on both light and
  busy backgrounds; test over a colorful tile, not only over paper.

## How it is implemented here

- `.glass` in `src/styles/base.css`: translucent fill, `backdrop-filter`
  blur and saturate, a lit top edge, a hairline ring, a soft shadow, and a
  diagonal specular via `::before`. `.glass--strong` for raised elements.
- The paper ground carries a soft ambient color wash (`body::before`) so glass
  has something to refract. Glass over flat paper reads as grey.
- Glass elements in use: back button, title capsule, settings button,
  `Segmented` track and thumb, `PinPad` keys, settings groups, `Celebrate`
  card, brush-size picker.
- Opaque by rule: coloring sheets, the doodle canvas, the tic-tac-toe board,
  memory cards, tiles, and the crayon cup. These use `.sheet` or solid color.

## Review checklist

- [ ] Every glass element is something the user operates.
- [ ] No glass element contains another glass element.
- [ ] At most one tinted control per screen.
- [ ] Nested radii are concentric (inner = outer minus padding).
- [ ] Controls do not overlap resting content; scrolling content passes fully beneath.
- [ ] Legible over the busiest tile and over plain paper.
- [ ] Reduced motion and increased contrast handled.
