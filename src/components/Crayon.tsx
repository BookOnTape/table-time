import type { ReactNode } from "react";
import "./Crayon.css";

interface Props {
  color: string;
  selected?: boolean;
  done?: boolean;
  label?: ReactNode;
  ariaLabel: string;
  onClick: () => void;
  /** Paper-colored crayon with an ink outline, used for the eraser. */
  outline?: boolean;
}

/** A crayon standing in the cup. The label sits on its paper wrapper. */
export function Crayon({ color, selected, done, label, ariaLabel, onClick, outline }: Props) {
  return (
    <button
      role="radio"
      aria-checked={!!selected}
      aria-label={ariaLabel}
      className={`crayon press ${selected ? "crayon--on" : ""} ${done ? "crayon--done" : ""} ${outline ? "crayon--outline" : ""}`}
      style={{ "--c": color } as React.CSSProperties}
      onClick={onClick}
    >
      <span className="crayon__body">
        <span className="crayon__wrap">{label}</span>
      </span>
    </button>
  );
}

export function CrayonCup({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="cup" role="radiogroup" aria-label={label}>
      {children}
    </div>
  );
}
