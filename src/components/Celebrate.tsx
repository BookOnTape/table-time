import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function Celebrate({
  icon,
  accent,
  title,
  text,
  actions,
}: {
  icon: IconName;
  accent?: string;
  title: string;
  text?: string;
  actions: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="celebrate" role="dialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1}>
      <div className="celebrate__card pop" style={{ "--accent": accent } as React.CSSProperties}>
        <div className="celebrate__badge">
          <Icon name={icon} size={40} />
        </div>
        <h2 className="celebrate__title">{title}</h2>
        {text && <p className="celebrate__text">{text}</p>}
        <div className="celebrate__actions">{actions}</div>
      </div>
    </div>
  );
}
