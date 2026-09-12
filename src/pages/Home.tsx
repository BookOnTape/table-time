import { useMemo } from "react";
import { Link } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { Carousel } from "@/components/Carousel";
import { Icon } from "@/components/Icon";
import { sectionPath, sections, tilesForSection } from "@/activities/registry";
import { useSettings } from "@/lib/settings";
import "./Home.css";

function greeting(name: string): string {
  const h = new Date().getHours();
  const time = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return name ? `${time}, ${name}.` : `${time}.`;
}

export function Home() {
  const { settings } = useSettings();
  const hidden = useMemo(() => new Set(settings.hiddenActivities), [settings.hiddenActivities]);

  const shelves = sections
    .map((s) => ({ section: s, items: tilesForSection(s.id, hidden) }))
    .filter((s) => s.items.length > 0);

  return (
    <>
      <TopBar
        right={
          <Link to="/settings" className="iconBtn press" aria-label="Parent settings">
            <Icon name="sliders" size={22} />
          </Link>
        }
      />
      <main className="page home">
        <header className="home__hero rise">
          <span className="wordmark">
            <span className="wordmark__dot" aria-hidden="true" />
            Table Time
          </span>
          <h1 className="home__title">{greeting(settings.childName)}</h1>
          <p className="lede">What should we play while we wait?</p>
        </header>

        {shelves.map(({ section, items }, i) => (
          <section key={section.id} className="shelf rise" style={{ animationDelay: `${80 + i * 60}ms` }}>
            <div className="shelf__head">
              <div className="shelf__name">
                <span className="shelf__swatch" style={{ background: section.accent }} aria-hidden="true" />
                <h2>{section.title}</h2>
                <span className="shelf__count">{items.length}</span>
              </div>
              <Link to={sectionPath(section.id)} className="shelf__more">
                See all <Icon name="chevronRight" size={16} strokeWidth={3} />
              </Link>
            </div>
            <Carousel items={items} />
          </section>
        ))}

        {shelves.length === 0 && <p className="lede">A parent has hidden every activity. Open settings to turn some back on.</p>}
      </main>
    </>
  );
}
