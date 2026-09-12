import { lazy } from "react";
import type { ActivityDef, ActivityProps, SectionDef, TileItem } from "./types";
import { colorByNumberScenes } from "./color-by-number/scenes";

/**
 * Adding an activity:
 *   1. Create `src/activities/<id>/index.tsx` exporting a default component
 *      that accepts `ActivityProps`.
 *   2. Add an entry to `activities` below (and a section if it needs one).
 * Everything else (home grid, section pages, settings visibility toggles,
 * routing) reads from these two arrays.
 */
export const sections: SectionDef[] = [
  {
    id: "coloring",
    title: "Coloring",
    icon: "palette",
    blurb: "Pictures to color by number",
    accent: "var(--bubblegum)",
  },
  {
    id: "games",
    title: "Games",
    icon: "dice",
    blurb: "Quick games for one or two",
    accent: "var(--cobalt)",
  },
  {
    id: "create",
    title: "Create",
    icon: "pencil",
    blurb: "Draw and make things",
    accent: "var(--marigold)",
  },
];

export const activities: ActivityDef[] = [
  {
    id: "color-by-number",
    title: "Color by Number",
    icon: "crayon",
    accent: "var(--bubblegum)",
    ages: "3+",
    section: "coloring",
    load: () => import("./color-by-number"),
    variants: colorByNumberScenes.map((s) => ({ id: s.id, title: s.title, icon: s.icon, accent: s.accent })),
    flattenVariants: true,
  },
  {
    id: "bubble-pop",
    title: "Bubble Pop",
    icon: "bubbles",
    blurb: "Pop them before they float away",
    accent: "var(--sky)",
    ages: "2+",
    section: "games",
    load: () => import("./bubble-pop"),
  },
  {
    id: "memory-match",
    title: "Memory Match",
    icon: "cards",
    blurb: "Flip cards, find the pairs",
    accent: "var(--plum)",
    ages: "3+",
    section: "games",
    load: () => import("./memory-match"),
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    icon: "xo",
    blurb: "Three in a row wins",
    accent: "var(--leaf)",
    ages: "4+",
    section: "games",
    load: () => import("./tic-tac-toe"),
  },
  {
    id: "restaurant-bingo",
    title: "Restaurant Bingo",
    icon: "dice",
    blurb: "Spot things at the table",
    accent: "var(--tomato)",
    ages: "3+",
    section: "games",
    load: () => import("./restaurant-bingo"),
  },
  {
    id: "doodle-pad",
    title: "Doodle Pad",
    icon: "brush",
    blurb: "Draw with crayons",
    accent: "var(--marigold)",
    ages: "2+",
    section: "create",
    load: () => import("./doodle-pad"),
  },
];

const componentCache = new Map<string, React.LazyExoticComponent<React.ComponentType<ActivityProps>>>();

export function getActivity(id: string | undefined): ActivityDef | undefined {
  return activities.find((a) => a.id === id);
}

export function getSection(id: string | undefined): SectionDef | undefined {
  return sections.find((s) => s.id === id);
}

export function getActivityComponent(def: ActivityDef) {
  let c = componentCache.get(def.id);
  if (!c) {
    c = lazy(def.load);
    componentCache.set(def.id, c);
  }
  return c;
}

export function activityPath(activityId: string, variantId?: string): string {
  return variantId ? `/play/${activityId}/${variantId}` : `/play/${activityId}`;
}

export function sectionPath(sectionId: string): string {
  return `/section/${sectionId}`;
}

/** Tiles for a section page. Flattened activities contribute one tile per variant. */
export function tilesForSection(sectionId: string, hidden: ReadonlySet<string>): TileItem[] {
  const out: TileItem[] = [];
  for (const a of activities) {
    if (a.section !== sectionId || hidden.has(a.id)) continue;
    if (a.flattenVariants && a.variants?.length) {
      for (const v of a.variants) {
        out.push({
          key: `${a.id}/${v.id}`,
          title: v.title,
          icon: v.icon,
          accent: v.accent ?? a.accent,
          to: activityPath(a.id, v.id),
        });
      }
    } else {
      out.push({
        key: a.id,
        title: a.title,
        icon: a.icon,
        accent: a.accent,
        to: activityPath(a.id),
        subtitle: a.blurb,
      });
    }
  }
  return out;
}

/** Tiles for the variant picker of a single activity. */
export function tilesForVariants(a: ActivityDef): TileItem[] {
  return (a.variants ?? []).map((v) => ({
    key: v.id,
    title: v.title,
    icon: v.icon,
    accent: v.accent ?? a.accent,
    to: activityPath(a.id, v.id),
  }));
}


