import "./Switch.css";

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

/** iOS-style toggle. */
export function Switch({ checked, onChange, label }: Props) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`switch ${checked ? "switch--on" : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className="switch__knob" />
    </button>
  );
}
