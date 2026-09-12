import type { TileItem } from "@/activities/types";
import { Tile } from "./Tile";
import "./Carousel.css";

/** Horizontal, snap-scrolling row of tiles. */
export function Carousel({ items }: { items: TileItem[] }) {
  return (
    <div className="carousel" role="list">
      {items.map((item, i) => (
        <div className="carousel__item" role="listitem" key={item.key}>
          <Tile item={item} index={i} />
        </div>
      ))}
    </div>
  );
}
