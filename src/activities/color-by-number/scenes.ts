/**
 * Color-by-number scenes are pure data: a palette (number -> color) and a
 * list of SVG regions, each tagged with the palette number it should get.
 * Regions draw in array order, so put backgrounds first.
 *
 * To add a scene: append to `colorByNumberScenes`. The shape helpers below
 * return both the path and a label position, so you rarely need raw paths.
 */

export interface PaletteEntry {
  n: number;
  color: string;
  name: string;
}

export interface Region {
  id: string;
  /** SVG path data. */
  d: string;
  /** Palette number this region should be colored with. */
  n: number;
  /** Where the number label sits. */
  lx: number;
  ly: number;
}

export interface Decor {
  d: string;
  stroke: string;
  width: number;
}

export interface Scene {
  id: string;
  title: string;
  emoji: string;
  accent: string;
  palette: PaletteEntry[];
  regions: Region[];
  /** Non-interactive outlines drawn on top (antennae, whiskers, rays). */
  decor?: Decor[];
}

type Shape = { d: string; cx: number; cy: number };

function rect(x: number, y: number, w: number, h: number, r = 0): Shape {
  const d =
    r > 0
      ? `M${x + r},${y}h${w - 2 * r}a${r},${r} 0 0 1 ${r},${r}v${h - 2 * r}a${r},${r} 0 0 1 -${r},${r}h-${w - 2 * r}a${r},${r} 0 0 1 -${r},-${r}v-${h - 2 * r}a${r},${r} 0 0 1 ${r},-${r}z`
      : `M${x},${y}h${w}v${h}h-${w}z`;
  return { d, cx: x + w / 2, cy: y + h / 2 };
}

function circle(cx: number, cy: number, r: number): Shape {
  return {
    d: `M${cx - r},${cy}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 -${2 * r},0z`,
    cx,
    cy,
  };
}

function ellipse(cx: number, cy: number, rx: number, ry: number): Shape {
  return {
    d: `M${cx - rx},${cy}a${rx},${ry} 0 1 0 ${2 * rx},0a${rx},${ry} 0 1 0 -${2 * rx},0z`,
    cx,
    cy,
  };
}

function poly(...pts: [number, number][]): Shape {
  const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join("") + "z";
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
  return { d, cx, cy };
}

let counter = 0;
function R(n: number, s: Shape, label?: [number, number]): Region {
  counter += 1;
  return { id: `r${counter}`, d: s.d, n, lx: label?.[0] ?? s.cx, ly: label?.[1] ?? s.cy };
}

const BG = rect(0, 0, 400, 400);

export const colorByNumberScenes: Scene[] = [
  {
    id: "rocket",
    title: "Rocket",
    emoji: "🚀",
    accent: "var(--indigo)",
    palette: [
      { n: 1, color: "#BFD9FF", name: "Sky" },
      { n: 2, color: "#FFE066", name: "Yellow" },
      { n: 3, color: "#FF5C5C", name: "Red" },
      { n: 4, color: "#FF9F43", name: "Orange" },
      { n: 5, color: "#7ED6FF", name: "Light blue" },
      { n: 6, color: "#FFB84D", name: "Fire" },
    ],
    regions: [
      R(1, BG, [60, 380]),
      R(2, circle(320, 80, 36)),
      R(2, circle(70, 60, 16)),
      R(2, circle(130, 130, 14)),
      R(2, circle(340, 210, 15)),
      R(2, circle(60, 300, 14)),
      R(4, poly([160, 230], [110, 310], [160, 310])),
      R(4, poly([240, 230], [290, 310], [240, 310])),
      R(6, poly([172, 300], [200, 375], [228, 300])),
      R(3, rect(160, 120, 80, 180, 12), [200, 250]),
      R(4, poly([160, 122], [200, 45], [240, 122])),
      R(5, circle(200, 180, 24)),
    ],
  },
  {
    id: "fish",
    title: "Fish",
    emoji: "🐠",
    accent: "var(--teal)",
    palette: [
      { n: 1, color: "#A8E4FF", name: "Water" },
      { n: 2, color: "#F6DFA6", name: "Sand" },
      { n: 3, color: "#7BD389", name: "Seaweed" },
      { n: 4, color: "#FF9F43", name: "Orange" },
      { n: 5, color: "#FFD23F", name: "Yellow" },
      { n: 6, color: "#2B2D42", name: "Eye" },
      { n: 7, color: "#EAF6FF", name: "Bubble" },
    ],
    regions: [
      R(1, BG, [40, 40]),
      R(2, poly([0, 330], [400, 330], [400, 400], [0, 400])),
      R(3, ellipse(60, 300, 16, 56)),
      R(3, ellipse(345, 305, 16, 50)),
      R(5, poly([282, 200], [350, 150], [350, 250])),
      R(5, poly([160, 150], [205, 92], [250, 150]), [205, 130]),
      R(4, ellipse(200, 200, 92, 56)),
      R(6, circle(150, 190, 15)),
      R(7, circle(110, 110, 18)),
      R(7, circle(140, 72, 14)),
      R(7, circle(100, 44, 13)),
    ],
  },
  {
    id: "house",
    title: "House",
    emoji: "🏠",
    accent: "var(--orange)",
    palette: [
      { n: 1, color: "#BFE3FF", name: "Sky" },
      { n: 2, color: "#8CD867", name: "Green" },
      { n: 3, color: "#FFE066", name: "Sun" },
      { n: 4, color: "#FFE0B2", name: "Wall" },
      { n: 5, color: "#FF6B6B", name: "Roof" },
      { n: 6, color: "#A0673B", name: "Wood" },
      { n: 7, color: "#7ED6FF", name: "Window" },
      { n: 8, color: "#FFFFFF", name: "Cloud" },
    ],
    regions: [
      R(1, BG, [230, 60]),
      R(2, rect(0, 300, 400, 100), [340, 350]),
      R(3, circle(330, 70, 40)),
      R(8, ellipse(120, 80, 50, 24)),
      R(6, rect(30, 250, 26, 70)),
      R(2, circle(43, 222, 42)),
      R(4, rect(90, 180, 200, 140), [130, 290]),
      R(5, poly([68, 185], [190, 88], [312, 185])),
      R(6, rect(165, 240, 52, 80, 8)),
      R(7, rect(110, 205, 42, 42)),
      R(7, rect(228, 205, 42, 42)),
    ],
  },
  {
    id: "butterfly",
    title: "Butterfly",
    emoji: "🦋",
    accent: "var(--purple)",
    palette: [
      { n: 1, color: "#E8F8F0", name: "Air" },
      { n: 2, color: "#8CD867", name: "Grass" },
      { n: 3, color: "#FF7EB6", name: "Pink" },
      { n: 4, color: "#FFE066", name: "Yellow" },
      { n: 5, color: "#B388FF", name: "Purple" },
      { n: 6, color: "#FF9F43", name: "Orange" },
      { n: 7, color: "#2B2D42", name: "Body" },
    ],
    regions: [
      R(1, BG, [40, 40]),
      R(2, rect(0, 330, 400, 70), [200, 375]),
      R(3, circle(60, 300, 24)),
      R(3, circle(340, 300, 24)),
      R(5, ellipse(138, 150, 72, 62), [160, 118]),
      R(5, ellipse(262, 150, 72, 62), [240, 118]),
      R(6, ellipse(150, 245, 56, 46)),
      R(6, ellipse(250, 245, 56, 46)),
      R(4, circle(122, 148, 20)),
      R(4, circle(278, 148, 20)),
      R(7, ellipse(200, 205, 18, 88)),
      R(7, circle(200, 105, 19)),
    ],
    decor: [
      { d: "M190,90 Q170,60 150,52", stroke: "#2B2D42", width: 4 },
      { d: "M210,90 Q230,60 250,52", stroke: "#2B2D42", width: 4 },
    ],
  },
  {
    id: "ice-cream",
    title: "Ice Cream",
    emoji: "🍦",
    accent: "var(--pink)",
    palette: [
      { n: 1, color: "#FFF0F5", name: "Pink air" },
      { n: 2, color: "#E0A96D", name: "Cone" },
      { n: 3, color: "#FF8FAB", name: "Strawberry" },
      { n: 4, color: "#A8E6CF", name: "Mint" },
      { n: 5, color: "#8D5524", name: "Chocolate" },
      { n: 6, color: "#FF3B30", name: "Cherry" },
    ],
    regions: [
      R(1, BG, [60, 60]),
      R(2, poly([138, 222], [262, 222], [200, 385]), [200, 305]),
      R(3, circle(200, 205, 64)),
      R(4, circle(200, 135, 54)),
      R(5, circle(200, 78, 44)),
      R(6, circle(200, 30, 16)),
    ],
    decor: [{ d: "M200,16 Q206,4 220,6", stroke: "#4B6043", width: 4 }],
  },
];

export function getScene(id: string | undefined): Scene | undefined {
  return colorByNumberScenes.find((s) => s.id === id);
}
