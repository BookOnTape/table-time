import type { TileItem } from "@/activities/types";
import { Tile } from "./Tile";
import "./TileGrid.css";

interface Props {
  items: TileItem[];
  emptyText?: string;
}

/** Responsive grid that grows with the list, so a section can scroll forever. */
export function TileGrid({ items, emptyText = "Nothing here yet." }: Props) {
  if (items.length === 0) return <p className="tileGrid__empty">{emptyText}</p>;
  return (
    <div className="tileGrid">
      {items.map((item, i) => (
        <Tile key={item.key} item={item} index={i} />
      ))}
    </div>
  );
}
