import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { TileGrid } from "@/components/TileGrid";
import { getSection, tilesForSection } from "@/activities/registry";
import { useSettings } from "@/lib/settings";

export function SectionPage() {
  const { sectionId } = useParams();
  const section = getSection(sectionId);
  const { settings } = useSettings();
  const hidden = useMemo(() => new Set(settings.hiddenActivities), [settings.hiddenActivities]);

  if (!section) return <Navigate to="/" replace />;

  const items = tilesForSection(section.id, hidden);

  return (
    <>
      <TopBar backTo="/" title={`${section.emoji} ${section.title}`} large />
      <main className="page">
        <p className="subtitle" style={{ paddingBottom: 14 }}>
          {section.blurb}
        </p>
        <TileGrid items={items} />
      </main>
    </>
  );
}
