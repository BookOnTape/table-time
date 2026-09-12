import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "@/components/TopBar";
import { PinPad } from "@/components/PinPad";
import { SwitchTrack } from "@/components/Switch";
import { Icon } from "@/components/Icon";
import { ConfirmSheet } from "@/components/ConfirmSheet";
import { activities, sections } from "@/activities/registry";
import { useSettings } from "@/lib/settings";
import { DEFAULT_PIN, hashPin, verifyPin } from "@/lib/pin";
import { clearNamespace } from "@/lib/storage";
import { setSoundEnabled } from "@/lib/sound";
import "./SettingsPage.css";

type PinFlow = null | "new" | "confirm";

export function SettingsPage() {
  const navigate = useNavigate();
  const { settings, update, toggleActivityHidden, unlocked, setUnlocked } = useSettings();
  const [pinFlow, setPinFlow] = useState<PinFlow>(null);
  const [pendingPin, setPendingPin] = useState("");
  const [pinMismatch, setPinMismatch] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // A parent who leaves with Back (rather than the Lock button) shouldn't
  // hand the child an unlocked settings screen next time it opens.
  useEffect(() => () => setUnlocked(false), [setUnlocked]);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  }

  if (!unlocked) {
    return (
      <>
        <TopBar backTo="/" title="Parents" />
        <main className="page">
          <PinPad
            title="Enter passcode"
            subtitle={settings.pinHash ? undefined : `First time? The default passcode is ${DEFAULT_PIN}.`}
            onSubmit={async (pin) => {
              const ok = await verifyPin(pin, settings.pinHash);
              if (ok) setUnlocked(true);
              return ok;
            }}
            onCancel={() => navigate("/")}
          />
        </main>
      </>
    );
  }

  if (pinFlow === "new") {
    return (
      <>
        <TopBar title="Change passcode" />
        <main className="page">
          <PinPad
            title="New passcode"
            subtitle={pinMismatch ? "Didn't match. Try again." : "Choose 4 digits."}
            onSubmit={(pin) => {
              setPendingPin(pin);
              setPinMismatch(false);
              setPinFlow("confirm");
              return true;
            }}
            onCancel={() => {
              setPinMismatch(false);
              setPinFlow(null);
            }}
          />
        </main>
      </>
    );
  }

  if (pinFlow === "confirm") {
    return (
      <>
        <TopBar title="Change passcode" />
        <main className="page">
          <PinPad
            key="confirm"
            title="Confirm passcode"
            subtitle="Enter the same 4 digits again."
            onSubmit={async (pin) => {
              if (pin !== pendingPin) {
                setTimeout(() => {
                  setPinFlow("new");
                  setPendingPin("");
                  setPinMismatch(true);
                }, 500);
                return false;
              }
              update({ pinHash: await hashPin(pin) });
              setPinFlow(null);
              setPendingPin("");
              flash("Passcode updated");
              return true;
            }}
            onCancel={() => setPinFlow(null)}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar
        backTo="/"
        title="Parents"
        large
        right={
          <button
            className="settings__lock"
            onClick={() => {
              setUnlocked(false);
              navigate("/");
            }}
          >
            Lock
          </button>
        }
      />
      <main className="page settings">
        <h3 className="settings__groupTitle">Kid</h3>
        <div className="settings__group">
          <label className="settings__row">
            <span className="settings__label">Name</span>
            <input
              className="settings__input"
              type="text"
              inputMode="text"
              autoComplete="off"
              placeholder="Optional"
              maxLength={24}
              value={settings.childName}
              onChange={(e) => update({ childName: e.target.value })}
            />
          </label>
          <button
            type="button"
            className="settings__row settings__row--toggle"
            role="switch"
            aria-checked={settings.sound}
            aria-label="Sound effects"
            onClick={() => {
              const v = !settings.sound;
              update({ sound: v });
              setSoundEnabled(v);
            }}
          >
            <span className="settings__label">Sound effects</span>
            <SwitchTrack checked={settings.sound} />
          </button>
        </div>

        <h3 className="settings__groupTitle">Activities</h3>
        <p className="settings__hint">Turn off anything you don't want showing on the kid's screen.</p>
        {sections.map((s) => {
          const list = activities.filter((a) => a.section === s.id);
          if (list.length === 0) return null;
          return (
            <div key={s.id} className="settings__group">
              <div className="settings__row settings__row--header">
                <span className="settings__sectionName">
                  <span className="settings__dot" style={{ background: s.accent }} aria-hidden="true" />
                  {s.title}
                </span>
              </div>
              {list.map((a) => {
                const shown = !settings.hiddenActivities.includes(a.id);
                return (
                  <button
                    key={a.id}
                    type="button"
                    className="settings__row settings__row--toggle"
                    role="switch"
                    aria-checked={shown}
                    aria-label={`Show ${a.title}`}
                    onClick={() => toggleActivityHidden(a.id)}
                  >
                    <span className="settings__label">
                      <span className="settings__glyph" style={{ background: a.accent }} aria-hidden="true">
                        <Icon name={a.icon} size={18} />
                      </span>
                      <span>
                        {a.title}
                        <span className="settings__meta">Ages {a.ages}</span>
                      </span>
                    </span>
                    <SwitchTrack checked={shown} />
                  </button>
                );
              })}
            </div>
          );
        })}

        <h3 className="settings__groupTitle">Security</h3>
        <div className="settings__group">
          <button className="settings__row settings__row--button" onClick={() => setPinFlow("new")}>
            <span className="settings__label">Change passcode</span>
            <Icon name="chevronRight" size={18} strokeWidth={2.8} className="settings__chevron" />
          </button>
        </div>

        <h3 className="settings__groupTitle">Data</h3>
        <div className="settings__group">
          <button className="settings__row settings__row--button" onClick={() => setConfirmingReset(true)}>
            <span className="settings__label settings__label--danger">
              <Icon name="trash" size={18} />
              Clear progress
            </span>
          </button>
        </div>
        <p className="settings__hint">Everything stays on this phone.</p>

        {toast && (
          <div className="settings__toast pop" role="status">
            {toast}
          </div>
        )}

        {confirmingReset && (
          <ConfirmSheet
            title="Clear coloring pages and best scores?"
            confirmLabel="Clear"
            onConfirm={() => {
              clearNamespace("progress");
              setConfirmingReset(false);
              flash("Progress cleared");
            }}
            onCancel={() => setConfirmingReset(false)}
          />
        )}
      </main>
    </>
  );
}
