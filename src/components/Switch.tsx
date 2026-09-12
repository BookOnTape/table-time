import "./Switch.css";

/** The visual track and knob only, for embedding inside a larger tap target
 * (e.g. a whole settings row) that owns the click and switch semantics. */
export function SwitchTrack({ checked }: { checked: boolean }) {
  return (
    <span className={`switch ${checked ? "switch--on" : ""}`} aria-hidden="true">
      <span className="switch__knob" />
    </span>
  );
}

interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

/** iOS-style toggle, self-contained as its own tap target. */
export function Switch({ checked, onChange, label }: Props) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}>
      <SwitchTrack checked={checked} />
    </button>
  );
}
