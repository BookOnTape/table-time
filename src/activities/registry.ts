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
    emoji: "🎨",
    blurb: "Color by number scenes",
    accent: "var(--pink)",
  },
  {
    id: "games",
    title: "Games",
    emoji: "🎲",
    blurb: "Quick games for one or two",
    accent: "var(--blue)",
  },
  {
    id: "create",
    title: "Create",
    emoji: "✏️",
    blurb: "Draw and make things",
    accent: "var(--orange)",
  },
];

export const activities: ActivityDef[] = [
  {
    id: "color-by-number",
    title: "Color by Number",
    emoji: "🖍️",
    blurb: "Tap a number, then tap the picture",
    accent: "var(--pink)",
    ages: "3+",
    section: "coloring",
    load: () => import("./color-by-number"),
    variants: colorByNumberScenes.map((s) => ({ id: s.id, title: s.title, emoji: s.emoji, accent: s.accent })),
    flattenVariants: true,
  },
  {
    id: "bubble-pop",
    title: "Bubble Pop",
    emoji: "🫧",
    blurb: "Pop the bubbles before they float away",
    accent: "var(--teal)",
    ages: "2+",
    section: "games",
    load: () => import("./bubble-pop"),
  },
  {
    id: "memory-match",
    title: "Memory Match",
    emoji: "🃏",
    blurb: "Flip cards and find the pairs",
    accent: "var(--purple)",
    ages: "3+",
    section: "games",
    load: () => import("./memory-match"),
  },
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    emoji: "🐱",
    blurb: "Cats versus dogs, three in a row",
    accent: "var(--green)",
    ages: "4+",
    section: "games",
    load: () => import("./tic-tac-toe"),
  },
  {
    id: "doodle-pad",
    title: "Doodle Pad",
    emoji: "🖌️",
    blurb: "Finger paint with big bright colors",
    accent: "var(--orange)",
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
          emoji: v.emoji,
          accent: v.accent ?? a.accent,
          to: activityPath(a.id, v.id),
          subtitle: a.title,
        });
      }
    } else {
      out.push({
        key: a.id,
        title: a.title,
        emoji: a.emoji,
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
    emoji: v.emoji,
    accent: v.accent ?? a.accent,
    to: activityPath(a.id, v.id),
  }));
}

/** Number of visible tiles a section would show; used for badges on the home grid. */
export function countForSection(sectionId: string, hidden: ReadonlySet<string>): number {
  return tilesForSection(sectionId, hidden).length;
}

/** One tile per visible activity, for the home "quick picks" carousel. */
export function quickPicks(hidden: ReadonlySet<string>): TileItem[] {
  return activities
    .filter((a) => !hidden.has(a.id))
    .map((a) => ({
      key: a.id,
      title: a.title,
      emoji: a.emoji,
      accent: a.accent,
      to: activityPath(a.id),
      subtitle: a.blurb,
    }));
}
