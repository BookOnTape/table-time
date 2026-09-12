import { useEffect, useState } from "react";
import { PIN_LENGTH } from "@/lib/pin";
import { Icon } from "./Icon";
import "./PinPad.css";

interface Props {
  title: string;
  subtitle?: string;
  /** Resolve true to accept; false shakes and clears. */
  onSubmit: (pin: string) => Promise<boolean> | boolean;
  onCancel?: () => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

export function PinPad({ title, subtitle, onSubmit, onCancel }: Props) {
  const [pin, setPin] = useState("");
  const [shaking, setShaking] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (pin.length !== PIN_LENGTH || busy) return;
    let cancelled = false;
    setBusy(true);
    Promise.resolve(onSubmit(pin)).then((ok) => {
      if (cancelled) return;
      setBusy(false);
      if (!ok) {
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setPin("");
        }, 420);
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  function press(k: string) {
    if (busy || shaking) return;
    if (k === "del") setPin((p) => p.slice(0, -1));
    else if (k && pin.length < PIN_LENGTH) setPin((p) => p + k);
  }

  return (
    <div className="pinpad rise">
      <div className="pinpad__lock">
        <Icon name="lock" size={26} />
      </div>
      <h2 className="pinpad__title">{title}</h2>
      {subtitle && <p className="pinpad__subtitle">{subtitle}</p>}
      <div className={`pinpad__dots ${shaking ? "shake" : ""}`} aria-label={`${pin.length} of ${PIN_LENGTH} digits entered`}>
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span key={i} className={`pinpad__dot ${i < pin.length ? "pinpad__dot--on" : ""}`} />
        ))}
      </div>
      <div className="pinpad__keys">
        {KEYS.map((k, i) =>
          k === "" ? (
            <span key={i} />
          ) : (
            <button
              key={i}
              className={`pinpad__key press ${k === "del" ? "pinpad__key--ghost" : ""}`}
              onClick={() => press(k)}
              aria-label={k === "del" ? "Delete" : k}
            >
              {k === "del" ? <Icon name="backspace" size={26} /> : k}
            </button>
          ),
        )}
      </div>
      {onCancel && (
        <button className="pinpad__cancel" onClick={onCancel}>
          Cancel
        </button>
      )}
    </div>
  );
}
