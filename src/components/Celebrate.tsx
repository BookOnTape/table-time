import type { ReactNode } from "react";

export function Celebrate({
  emoji,
  title,
  text,
  actions,
}: {
  emoji: string;
  title: string;
  text?: string;
  actions: ReactNode;
}) {
  return (
    <div className="celebrate" role="dialog" aria-label={title}>
      <div className="celebrate__card pop">
        <div className="celebrate__emoji" aria-hidden="true">{emoji}</div>
        <h2 className="celebrate__title">{title}</h2>
        {text && <p className="celebrate__text">{text}</p>}
        <div className="celebrate__actions">{actions}</div>
      </div>
    </div>
  );
}
