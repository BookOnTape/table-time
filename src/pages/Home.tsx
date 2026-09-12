import { useMemo } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { TileGrid } from "@/components/TileGrid";
import { Carousel } from "@/components/Carousel";
import { countForSection, quickPicks, sectionPath, sections } from "@/activities/registry";
import { useSettings } from "@/lib/settings";
import type { TileItem } from "@/activities/types";

function greeting(name: string): string {
  const h = new Date().getHours();
  const time = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return name ? `${time}, ${name}!` : `${time}!`;
}

export function Home() {
  const { settings } = useSettings();
  const hidden = useMemo(() => new Set(settings.hiddenActivities), [settings.hiddenActivities]);

  const sectionTiles: TileItem[] = sections
    .map((s) => {
      const n = countForSection(s.id, hidden);
      return {
        key: s.id,
        title: s.title,
        emoji: s.emoji,
        accent: s.accent,
        to: sectionPath(s.id),
        subtitle: n === 1 ? "1 activity" : `${n} activities`,
        count: n,
      };
    })
    .filter((t) => t.count > 0);

  const picks = quickPicks(hidden);

  return (
    <>
      <TopBar
        right={
          <Link to="/settings" className="iconButton press" aria-label="Parent settings">
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.9 4.4.1-.9-.1-.9 2-1.6-1.9-3.3-2.4 1a7 7 0 0 0-1.6-.9L16.6 3H12.4l-.4 2.3a7 7 0 0 0-1.6.9l-2.4-1L6.1 8.5l2 1.6-.1.9.1.9-2 1.6 1.9 3.3 2.4-1a7 7 0 0 0 1.6.9l.4 2.3h4.2l.4-2.3a7 7 0 0 0 1.6-.9l2.4 1 1.9-3.3-2-1.6Z"
              />
            </svg>
          </Link>
        }
      />
      <main className="page">
        <h1 className="largeTitle rise">{greeting(settings.childName)}</h1>
        <p className="subtitle rise">What do you want to play?</p>

        <div className="sectionHeader">
          <h2>Pick a section</h2>
        </div>
        <TileGrid items={sectionTiles} size="lg" emptyText="A parent has hidden every activity." />

        {picks.length > 0 && (
          <>
            <div className="sectionHeader">
              <h2>Quick picks</h2>
            </div>
            <Carousel items={picks} />
          </>
        )}
      </main>
    </>
  );
}
