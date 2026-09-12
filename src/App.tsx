import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { SettingsProvider, useSettings } from "@/lib/settings";
import { setSoundEnabled } from "@/lib/sound";
import { Home } from "@/pages/Home";
import { SectionPage } from "@/pages/SectionPage";
import { PlayPage } from "@/pages/PlayPage";
import { SettingsPage } from "@/pages/SettingsPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function SoundSync() {
  const { settings } = useSettings();
  useEffect(() => {
    setSoundEnabled(settings.sound);
  }, [settings.sound]);
  return null;
}

export default function App() {
  return (
    <SettingsProvider>
      <SoundSync />
      {/* HashRouter: deep links work on any static host without rewrite rules. */}
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/section/:sectionId" element={<SectionPage />} />
          <Route path="/play/:activityId" element={<PlayPage />} />
          <Route path="/play/:activityId/:variantId" element={<PlayPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </HashRouter>
    </SettingsProvider>
  );
}
