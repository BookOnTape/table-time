import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import "./TopBar.css";

interface Props {
  title?: string;
  /** Where the back chevron goes. Omit to hide the back button. */
  backTo?: string;
  right?: ReactNode;
  /** Large iOS-style title below the bar instead of an inline title. */
  large?: boolean;
}

export function TopBar({ title, backTo, right, large }: Props) {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div className="topbar__row">
        <div className="topbar__slot topbar__slot--left">
          {backTo !== undefined && (
            <button
              className="topbar__back press"
              aria-label="Back"
              onClick={() => navigate(backTo)}
            >
              <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden="true">
                <path
                  d="M12 2 3 11l9 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Back</span>
            </button>
          )}
        </div>
        {!large && title && <h1 className="topbar__title">{title}</h1>}
        <div className="topbar__slot topbar__slot--right">{right}</div>
      </div>
      {large && title && <h1 className="topbar__large largeTitle">{title}</h1>}
    </header>
  );
}
