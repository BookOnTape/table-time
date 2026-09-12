# Design direction

Owner's brief: modern and clean. References: the Apple Sports app and Mini
Motorways. This document says what those two share, where Table Time already
matches, where it drifts, and what to change, in order. Read it with
`CLAUDE.md` (the system as built) and `docs/review-2026-09-12.md` (defects).

## What the references actually do

**Apple Sports.** Color is identity: a team's color floods the whole surface,
and everything else is white or near-black type on top of it. Numbers are the
hero, set huge in tabular figures. Chrome is nearly absent: a slim segmented
switch, a couple of icon buttons, no cards inside cards, no borders, no
decorative shadows. Hierarchy comes from size and weight, not from boxes.
Motion is reserved for things that change (a score ticking up), not for
entrances.

**Mini Motorways.** Flat fills only. No outlines, no gradients, no textures,
no drop shadows. One muted ground per city with a small set of saturated,
slightly dusty accents, each meaning one thing. Shapes are simple geometry with
soft corners. The interface almost disappears: a pause button, big pill
buttons in menus, a rounded geometric sans, generous empty space. Animation is
calm and physical, never showy. The whole thing feels considered because
nothing is there that does not need to be.

**What they share, and what "modern, clean" means for this app:**

1. Color carries identity; type carries hierarchy; boxes and lines carry
   nothing.
2. Flat fills. Depth comes from layering and blur (Apple) or nothing at all
   (Motorways), never from bevels, glows, or textures.
3. Chrome is minimal and quiet. One control that matters per screen.
4. Big, confident numbers and titles. Generous space around them.
5. Motion only where meaning changes.

## Where Table Time already matches

- One accent per activity and section, from a fixed six-crayon set. This is
  the Motorways idea and it is the strongest thing in the app. Keep it.
- Flat color tiles with a white glyph and the title set below on the ground,
  rather than in a card. Right.
- Two taps from home to play, one chrome for every activity.
- A custom stroke icon set instead of emoji. Right; Sports uses SF Symbols the
  same way.
- Bricolage Grotesque for display. Its personality does the work Sports gets
  from weight and size.

## Where it drifts from the references

- **Ornament crept in.** Tile glyphs have drop shadows; tiles carry a
  four-part shadow with a colored glow and a specular highlight; glass has a
  diagonal sheen; memory-card backs and the bubble field have dot-grid
  textures; the tic-tac-toe board is hand-ruled. Each is defensible alone;
  together they read as decorated, which is the opposite of the brief.
  Motorways has none of this. Sports has none of this.
- **Two visual languages compete.** "Paper and crayon" (ink outlines, hand
  rules, wrappers on crayons) and "Liquid Glass" (translucency, specular, blur)
  are both present. The references pick one register and hold it.
- **Too many shadows at one elevation.** Everything floats the same amount, so
  nothing floats.
- **Type scale is loose.** Fifteen sizes including half-pixels; headings on body
  line-height. Sports reads clean because it uses about five sizes.
- **Ink outlines on coloring pages are heavy (3 units on a 400 grid).**
  Necessary for a coloring book, but the current weight leans "activity sheet".
- **Ground is nearly white.** Sports and Motorways both use a distinctly
  colored ground (team color; the city's palette). The paper is fine as a base
  but the ambient wash behind it is timid, so the glass has little to show.

## Recommendations, in order

### 1. Pick the register: flat, with glass reserved for the top bar

Keep Liquid Glass on the floating top-bar controls only (back, title, parent
button). Everything else becomes flat fills. Segmented switch: ink thumb on a
paper-2 track, no blur. Keypad: paper-2 discs. Settings groups: white sheets.
Celebration: an opaque white sheet with one accent button. This resolves the
glass-on-glass defects in the review by removing most glass rather than
arranging it.

### 2. Strip ornament

- Remove the glyph drop shadow, the tile specular, the colored glow, and the
  inset rim. A tile is a flat rounded square in one crayon color with a white
  glyph. Motorways-flat.
- Remove the dot-grid textures. Memory-card backs become a solid ink square
  with a small centered glyph. The bubble field is plain paper.
- Replace the hand-ruled tic-tac-toe with a flat 3x3 of paper-2 tiles on a
  white sheet, 8px gaps, no lines.
- Keep exactly one shadow token for the one thing that floats (the top bar
  controls) and one soft sheet shadow. Delete the rest.
- Keep the crayon cup. It is the app's one signature object, and it is flat
  geometry, which is why it fits.

### 3. Let color flood the activity screen

Sports' best move. When an activity opens, the page ground tints toward that
activity's crayon color at low strength (about 10 to 14 percent over paper),
and the top-bar title capsule takes the accent. The child sees "I am in the
blue one" before reading anything. Cheap to do: set `--accent` on the chrome
root and derive the ground from it.

### 4. Make numbers the hero where numbers exist

Readouts (coloring progress, memory moves, bubble score) go to display size,
tabular figures, ink on ground, with the label small and above. A count-up on
change. This is the one place to spend motion.

### 5. Tighten type and space to a scale

Type: 12, 14, 17, 20, 24, 32, 44, and one fluid hero. Line-height 1.1 for
display, 1.4 for text. Space: 4, 8, 12, 16, 24, 32, 48. Radii: 12, 20, 28,
pill. Move every literal in the CSS onto these. Do it in one pass while fixing
the review's contrast and target-size items, since the same files are open.

### 6. Quiet the chrome

- Drop the shelf count badges and the eyebrow lines.
- Home: wordmark small, greeting large, then tiles. With nine tiles, one grid
  with three light section labels; no section pages until there are more than
  about twelve.
- Toolbar: one segmented control on the left, one readout on the right, one
  icon button. Never more.

### 7. Coloring pages

Lower the outline to 2 units and use `--ink` at 80 percent. Number labels in
the display face, same as readouts. Replace the primitive-shape scenes with
traced silhouettes (rocket, fish, house, butterfly, ice cream) drawn as closed
paths with five to nine regions each; the data format already supports it.
This is the largest remaining quality gap and it is art, not code.

## What not to do

- Do not add gradients, glows, or textures to make it "pop". The references
  pop through color and scale.
- Do not add a tab bar. Two levels of navigation do not need one.
- Do not use Apple's grey (`#F2F2F7`) or a dark theme. Paper plus crayons is
  the identity; a dark mode would be a second identity.
- Do not use rounded fonts (Nunito, Fredoka). They read as "kids app" in the
  way the owner explicitly does not want. Bricolage stays.

## Done looks like

Open any activity: one flooded color, one big number, one control, a flat
sheet to play on, and a crayon cup. Nothing else on screen. Someone who plays
Mini Motorways should feel at home; a parent who uses Apple Sports should
recognize the confidence.
