import type { ReactNode } from "react";
import "./ActivityChrome.css";

/**
 * Standard full-height frame for an activity: a slim toolbar row and a
 * stage area that fills the remaining viewport. Activities render inside
 * this so they all share the same rhythm.
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
    <div className="chrome" style={{ "--accent": accent ?? "var(--blue)" } as React.CSSProperties}>
      {toolbar && <div className="chrome__toolbar">{toolbar}</div>}
      <div className="chrome__stage">{children}</div>
    </div>
  );
}

export function Pill({
  active,
  onClick,
  children,
  ariaLabel,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <button
      className={`pill press ${active ? "pill--active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
