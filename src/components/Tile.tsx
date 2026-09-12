import { Link } from "react-router-dom";
import type { TileItem } from "@/activities/types";
import { Icon } from "./Icon";
import "./Tile.css";

interface Props {
  item: TileItem;
  index?: number;
}

/** A flat color block with a white glyph, title set below on the paper. */
export function Tile({ item, index = 0 }: Props) {
  return (
    <Link
      to={item.to}
      className="tile press rise"
      style={{ "--c": item.accent, animationDelay: `${Math.min(index, 10) * 35}ms` } as React.CSSProperties}
    >
      <div className="tile__block">
        <Icon name={item.icon} size="52%" strokeWidth={2.1} className="tile__glyph" />
      </div>
      <div className="tile__title">{item.title}</div>
      {item.subtitle && <div className="tile__meta">{item.subtitle}</div>}
    </Link>
  );
}
