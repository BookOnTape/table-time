import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { readJSON, writeJSON } from "./storage";

export interface Settings {
  /** Child's name, used in the greeting. */
  childName: string;
  /** Master sound toggle for activity sound effects. */
  sound: boolean;
  /** Activity ids the parent has hidden from the kid-facing UI. */
  hiddenActivities: string[];
  /** SHA-256 hash of the parent passcode; null means the default passcode. */
  pinHash: string | null;
}

const DEFAULTS: Settings = {
  childName: "",
  sound: true,
  hiddenActivities: [],
  pinHash: null,
};

const KEY = "settings";

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  toggleActivityHidden: (id: string) => void;
  /** True once the parent has entered the passcode this session. */
  unlocked: boolean;
  setUnlocked: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => ({
    ...DEFAULTS,
    ...readJSON<Partial<Settings>>(KEY, {}),
  }));
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    writeJSON(KEY, settings);
  }, [settings]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((s) => ({ ...s, ...patch }));
  }, []);

  const toggleActivityHidden = useCallback((id: string) => {
    setSettings((s) => {
      const hidden = new Set(s.hiddenActivities);
      if (hidden.has(id)) hidden.delete(id);
      else hidden.add(id);
      return { ...s, hiddenActivities: [...hidden] };
    });
  }, []);

  const value = useMemo(
    () => ({ settings, update, toggleActivityHidden, unlocked, setUnlocked }),
    [settings, update, toggleActivityHidden, unlocked],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <SettingsProvider>");
  return ctx;
}
