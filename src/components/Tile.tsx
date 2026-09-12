import { Link } from "react-router-dom";
import type { TileItem } from "@/activities/types";
import "./Tile.css";

interface Props {
  item: TileItem;
  /** Bigger emoji and title, used for top-level section tiles. */
  size?: "md" | "lg";
  index?: number;
}

export function Tile({ item, size = "md", index = 0 }: Props) {
  return (
    <Link
      to={item.to}
      className={`tile tile--${size} press rise`}
      style={{ "--accent": item.accent, animationDelay: `${Math.min(index, 12) * 30}ms` } as React.CSSProperties}
    >
      <div className="tile__art" aria-hidden="true">
        <span className="tile__emoji">{item.emoji}</span>
      </div>
      <div className="tile__text">
        <div className="tile__title">{item.title}</div>
        {item.subtitle && <div className="tile__subtitle">{item.subtitle}</div>}
      </div>
    </Link>
  );
}
