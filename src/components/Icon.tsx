import type { SVGProps } from "react";

/**
 * One consistent icon set drawn on a 24-unit grid, 2.4 stroke, round joins.
 * Filled glyphs (used as memory-card faces) set `fill: true`.
 * Replacing emoji with these is what makes the tiles read as one system.
 */
const ICONS = {
  // chrome
  chevronLeft: { d: "M15 5l-7 7 7 7" },
  chevronRight: { d: "M9 5l7 7-7 7" },
  sliders: { d: "M4 7h16M4 12h16M4 17h16", extra: <><circle cx="9" cy="7" r="2.2" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="2.2" fill="currentColor" stroke="none" /><circle cx="8" cy="17" r="2.2" fill="currentColor" stroke="none" /></> },
  lock: { d: "M8 11V7a4 4 0 0 1 8 0v4", extra: <rect x="5" y="11" width="14" height="10" rx="3" /> },
  backspace: { d: "M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7 6-7ZM12 10l4 4M16 10l-4 4" },
  undo: { d: "M4 10a8 8 0 1 1 2.3 7.7M4 4v6h6" },
  refresh: { d: "M20 12a8 8 0 1 1-2.34-5.66M20 4v5h-5" },
  trash: { d: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" },
  check: { d: "M5 12.5l4.5 4.5L19 7" },
  x: { d: "M6 6l12 12M18 6 6 18" },
  o: { d: "", extra: <circle cx="12" cy="12" r="7" /> },
  robot: { d: "M12 4v4", extra: <><rect x="4" y="8" width="16" height="12" rx="3.5" /><circle cx="9" cy="14" r="1.6" fill="currentColor" stroke="none" /><circle cx="15" cy="14" r="1.6" fill="currentColor" stroke="none" /><circle cx="12" cy="3" r="1.2" fill="currentColor" stroke="none" /></> },
  people: { d: "M2.5 20a5.5 5.5 0 0 1 11 0M10.5 20a5.5 5.5 0 0 1 11 0", extra: <><circle cx="8" cy="8" r="3" /><circle cx="16" cy="8" r="3" /></> },
  eraser: { d: "M4 16l9-9 6 6-6 6H8l-4-3ZM9 21h11" },

  // activities & sections
  palette: { d: "M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.6-2.2-.4-1.2.3-2.3 1.6-2.3H17a4 4 0 0 0 4-4 9 9 0 0 0-9-9.5Z", extra: <><circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" /><circle cx="11.5" cy="6.8" r="1.5" fill="currentColor" stroke="none" /><circle cx="15.5" cy="7.8" r="1.5" fill="currentColor" stroke="none" /><circle cx="7.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" /></> },
  dice: { d: "", extra: <><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" stroke="none" /></> },
  pencil: { d: "M4 20l4-1L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4ZM14 7l3 3" },
  crayon: { d: "M8 21h8V9H8v12ZM8 9l4-6 4 6M8 14h8" },
  bubbles: { d: "", extra: <><circle cx="9" cy="10" r="5" /><circle cx="17" cy="15.5" r="3.5" /><circle cx="6.5" cy="18.5" r="2" /></> },
  cards: { d: "M15.5 6.5l2.2.6a2 2 0 0 1 1.4 2.4L16.5 19", extra: <><rect x="4" y="5" width="11.5" height="15" rx="2.5" /><path d="M9.75 9.5l1 2 2.1.3-1.5 1.5.3 2.1-1.9-1-1.9 1 .3-2.1-1.5-1.5 2.1-.3 1-2Z" fill="currentColor" stroke="none" /></> },
  xo: { d: "M5 5l6 6M11 5l-6 6", extra: <circle cx="16.5" cy="16.5" r="3.6" /> },
  brush: { d: "M20 4l-9 9M7.5 20.5a3 3 0 0 1-3-3c0-1.7 1.3-3 3-3 1.5 0 2.8.9 3.4 2.3.3.7 0 1.5-.6 2.2-.8.9-1.8 1.5-2.8 1.5Z" },
  rocket: { d: "M12 2c3 2.5 4.5 6 4.5 10L14 15h-4l-2.5-3C7.5 8 9 4.5 12 2ZM9.5 15 8 20l4-2 4 2-1.5-5M7.5 12 5 15.5h3M16.5 12 19 15.5h-3", extra: <circle cx="12" cy="9" r="1.7" fill="currentColor" stroke="none" /> },
  fish: { d: "M3 12c3-4 6-6 9.5-6 3 0 5 2 6.5 6-1.5 4-3.5 6-6.5 6C9 18 6 16 3 12ZM17 12l4-4v8l-4-4", extra: <circle cx="8.5" cy="11" r="1.3" fill="currentColor" stroke="none" /> },
  house: { d: "M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-9ZM10 21v-6h4v6" },
  butterfly: { d: "M12 8.5v12M12 9.5c-2-4-6-6-8-4s0 7 3 8c-3 1-4 4-2 5s5 0 7-3M12 9.5c2-4 6-6 8-4s0 7-3 8c3 1 4 4 2 5s-5 0-7-3M10 3l2 3 2-3" },
  icecream: { d: "M8 11h8l-4 10-4-10ZM7.5 9.5a4.5 4.5 0 1 1 9 0" },

  // memory faces (filled)
  star: { fill: true, d: "M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9Z" },
  heart: { fill: true, d: "M12 21s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6-8 11-8 11Z" },
  moon: { fill: true, d: "M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" },
  cloud: { fill: true, d: "M7 19a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 9.5 4 4 0 0 1 17.5 19H7Z" },
  leaf: { fill: true, d: "M4 20c0-9 5-15 16-16 0 11-6 16-14 16" },
  bolt: { fill: true, d: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z" },
  sun: { fill: true, d: "M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1", extra: <circle cx="12" cy="12" r="4.5" fill="currentColor" stroke="none" /> },
  drop: { fill: true, d: "M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11Z" },
  sparkle: { fill: true, d: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" },
  trophy: { d: "M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6" },

  // i-spy / bingo pool
  dog: {
    d: "M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM6 8c-2-2-4-1-3 2s3 3 4 1M18 8c2-2 4-1 3 2s-3 3-4 1",
    extra: <circle cx="12" cy="14" r="1.3" fill="currentColor" stroke="none" />,
  },
  hat: { d: "M4 16c0-4 3.5-8 8-8s8 4 8 8M2 16h20" },
  straw: { d: "M6 8h12l-1.5 12a2 2 0 0 1-2 1.8h-5a2 2 0 0 1-2-1.8L6 8ZM9 8V4l6 2v2" },
  phone: { d: "M11 18h2", extra: <rect x="7" y="3" width="10" height="18" rx="2" /> },
  car: {
    d: "M4 16v-3l2-4h12l2 4v3M4 16h16M4 13h16",
    extra: (
      <>
        <circle cx="8" cy="17" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="16" cy="17" r="1.6" fill="currentColor" stroke="none" />
      </>
    ),
  },
  smile: {
    d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM8 14c1.2 1.6 2.8 2.4 4 2.4s2.8-.8 4-2.4",
    extra: (
      <>
        <circle cx="8.7" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="15.3" cy="9.5" r="1.1" fill="currentColor" stroke="none" />
      </>
    ),
  },
} as const;

export type IconName = keyof typeof ICONS;
export const iconNames = Object.keys(ICONS) as IconName[];

interface Props extends Omit<SVGProps<SVGSVGElement>, "d"> {
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
}

export function Icon({ name, size = 24, strokeWidth = 2.4, ...rest }: Props) {
  const def = ICONS[name] as { d: string; fill?: boolean; extra?: React.ReactNode };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={def.fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={def.fill ? 0 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {def.d && <path d={def.d} />}
      {def.extra}
    </svg>
  );
}
