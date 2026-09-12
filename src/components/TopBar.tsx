import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import "./TopBar.css";

interface Props {
  title?: string;
  /** Where the back button goes. Omit to hide it. */
  backTo?: string;
  right?: ReactNode;
  /** Large display title below the bar instead of an inline title. */
  large?: boolean;
  /** Optional small line above a large title. */
  eyebrow?: string;
}

export function TopBar({ title, backTo, right, large, eyebrow }: Props) {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div className="topbar__row">
        <div className="topbar__slot">
          {backTo !== undefined && (
            <button className="iconBtn press" aria-label="Back" onClick={() => navigate(backTo)}>
              <Icon name="chevronLeft" size={22} strokeWidth={2.8} />
            </button>
          )}
        </div>
        {!large && title && <h1 className="topbar__title">{title}</h1>}
        <div className="topbar__slot topbar__slot--right">{right}</div>
      </div>
      {large && title && (
        <div className="topbar__large">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h1 className="topbar__display">{title}</h1>
        </div>
      )}
    </header>
  );
}
