import type { TileItem } from "@/activities/types";
import { Tile } from "./Tile";
import "./TileGrid.css";

interface Props {
  items: TileItem[];
  size?: "md" | "lg";
  emptyText?: string;
}

/** Responsive, vertically scrolling grid. Grows with the item list, so it
 * behaves like an endless scroll as sections fill up. */
export function TileGrid({ items, size = "md", emptyText = "Nothing here yet." }: Props) {
  if (items.length === 0) {
    return <p className="tileGrid__empty">{emptyText}</p>;
  }
  return (
    <div className={`tileGrid tileGrid--${size}`}>
      {items.map((item, i) => (
        <Tile key={item.key} item={item} size={size} index={i} />
      ))}
    </div>
  );
}
