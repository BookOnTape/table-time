import type { ReactNode } from "react";
import "./ActivityChrome.css";

/**
 * Full-height frame for an activity: a toolbar row and a stage that fills
 * the rest of the viewport. `accent` tints buttons and highlights inside.
 */
export function ActivityChrome({
  toolbar,
  children,
  accent,
}: {
  toolbar?: ReactNode;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div className="chrome" style={{ "--accent": accent ?? "var(--cobalt)" } as React.CSSProperties}>
      {toolbar && <div className="chrome__toolbar">{toolbar}</div>}
      <div className="chrome__stage">{children}</div>
    </div>
  );
}

/** Right-aligned readout in a toolbar (score, moves, progress). */
export function Readout({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="readout" aria-live="polite">
      {label && <span className="readout__label">{label}</span>}
      <span className="readout__value">{children}</span>
    </div>
  );
}
