import type { ReactNode } from "react";
import "./Segmented.css";

export interface SegmentOption<T extends string> {
  value: T;
  label: ReactNode;
  ariaLabel?: string;
}

interface Props<T extends string> {
  value: T;
  options: SegmentOption<T>[];
  onChange: (v: T) => void;
  label: string;
}

/** Two-to-four way switch with a sliding ink thumb. */
export function Segmented<T extends string>({ value, options, onChange, label }: Props<T>) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div
      className="seg"
      role="radiogroup"
      aria-label={label}
      style={{ "--n": options.length, "--i": index } as React.CSSProperties}
    >
      <span className="seg__thumb" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={o.value === value}
          aria-label={o.ariaLabel}
          className={`seg__opt ${o.value === value ? "seg__opt--on" : ""}`}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
