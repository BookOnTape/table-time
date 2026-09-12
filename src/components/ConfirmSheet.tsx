import { useEffect, useRef } from "react";

/** A destructive-action confirm, styled like the app instead of the native
 * `confirm()` (which prints the page origin when running as an iOS
 * standalone app). */
export function ConfirmSheet({
  title,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="celebrate" role="alertdialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1}>
      <div className="celebrate__card pop" style={{ "--accent": "var(--tomato)" } as React.CSSProperties}>
        <h2 className="celebrate__title">{title}</h2>
        <div className="celebrate__actions">
          <button className="btn btn--accent" style={{ "--accent": "var(--tomato)" } as React.CSSProperties} onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className="btn btn--paper" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
