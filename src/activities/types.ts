import type { ComponentType } from "react";

/** A sub-option of an activity, e.g. one coloring scene. */
export interface Variant {
  id: string;
  title: string;
  emoji: string;
  /** Optional accent override; falls back to the activity accent. */
  accent?: string;
}

export interface ActivityProps {
  /** Present when the activity was opened through a specific variant. */
  variantId?: string;
}

export interface ActivityDef {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  /** Any CSS color; tints the tile and activity chrome. */
  accent: string;
  /** Rough age guidance shown to parents in settings. */
  ages: string;
  /** Id of the section this activity lives in. */
  section: string;
  /** Lazy import so each activity is its own chunk. */
  load: () => Promise<{ default: ComponentType<ActivityProps> }>;
  variants?: Variant[];
  /**
   * When true, a section grid shows one tile per variant instead of one tile
   * for the activity. Use it for activities that are really a library of
   * scenes or pages (coloring, mazes, dot-to-dots).
   */
  flattenVariants?: boolean;
}

export interface SectionDef {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  accent: string;
}

/** Something that renders as a tappable tile in a grid or carousel. */
export interface TileItem {
  key: string;
  title: string;
  emoji: string;
  accent: string;
  to: string;
  subtitle?: string;
}
