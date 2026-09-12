import { Suspense, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { TileGrid } from "@/components/TileGrid";
import { getActivity, getActivityComponent, sectionPath, tilesForVariants } from "@/activities/registry";
import { useSettings } from "@/lib/settings";

export function PlayPage() {
  const { activityId, variantId } = useParams();
  const activity = getActivity(activityId);
  const { settings } = useSettings();
  const hidden = useMemo(() => new Set(settings.hiddenActivities), [settings.hiddenActivities]);

  if (!activity || hidden.has(activity.id)) return <Navigate to="/" replace />;

  const backTo = sectionPath(activity.section);
  const variant = activity.variants?.find((v) => v.id === variantId);

  // Activity has variants but none was chosen: show the picker grid.
  if (activity.variants?.length && !variant) {
    if (variantId) return <Navigate to={`/play/${activity.id}`} replace />;
    return (
      <>
        <TopBar backTo={backTo} title={`${activity.emoji} ${activity.title}`} large />
        <main className="page">
          <p className="subtitle" style={{ paddingBottom: 14 }}>
            {activity.blurb}
          </p>
          <TileGrid items={tilesForVariants(activity)} />
        </main>
      </>
    );
  }

  const Component = getActivityComponent(activity);
  const title = variant ? `${variant.emoji} ${variant.title}` : `${activity.emoji} ${activity.title}`;

  return (
    <>
      <TopBar backTo={activity.flattenVariants ? backTo : variant ? `/play/${activity.id}` : backTo} title={title} />
      <Suspense fallback={<div className="page subtitle" style={{ paddingTop: 40, textAlign: "center" }}>Loading…</div>}>
        <Component key={`${activity.id}/${variant?.id ?? ""}`} variantId={variant?.id} />
      </Suspense>
    </>
  );
}
