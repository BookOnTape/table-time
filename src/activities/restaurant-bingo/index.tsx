import { useEffect, useState } from "react";
import type { ActivityProps } from "../types";
import { ActivityChrome } from "@/components/ActivityChrome";
import { Celebrate } from "@/components/Celebrate";
import { Icon, type IconName } from "@/components/Icon";
import { readJSON, writeJSON } from "@/lib/storage";
import { sfx } from "@/lib/sound";
import { useConfirmArm } from "@/lib/confirmArm";
import "./style.css";

/** Things a table at (or just outside) a restaurant tends to turn up, win or
 * lose on visibility of the street. Nine of these get dealt onto a card. */
const POOL: { id: string; icon: IconName; label: string }[] = [
  { id: "sun", icon: "sun", label: "Sunshine" },
  { id: "cloud", icon: "cloud", label: "A cloud" },
  { id: "moon", icon: "moon", label: "The moon" },
  { id: "star", icon: "star", label: "A twinkle light" },
  { id: "dessert", icon: "icecream", label: "A dessert" },
  { id: "talking", icon: "people", label: "Someone talking" },
  { id: "plant", icon: "leaf", label: "A plant" },
  { id: "drink", icon: "drop", label: "A drink" },
  { id: "dog", icon: "dog", label: "A dog" },
  { id: "hat", icon: "hat", label: "A hat" },
  { id: "straw", icon: "straw", label: "A straw" },
  { id: "phone", icon: "phone", label: "A phone" },
  { id: "car", icon: "car", label: "A car" },
  { id: "smile", icon: "smile", label: "A smile" },
];

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const STORAGE_KEY = "progress:bingo";

interface Saved {
  items: string[];
  marked: number[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function deal(): string[] {
  return shuffle(POOL.map((p) => p.id)).slice(0, 9);
}

function hasLine(marked: Set<number>): number[] | null {
  for (const line of LINES) {
    if (line.every((i) => marked.has(i))) return line;
  }
  return null;
}

export default function RestaurantBingo(_: ActivityProps) {
  const [items, setItems] = useState<string[]>(() => readJSON<Saved | null>(STORAGE_KEY, null)?.items ?? deal());
  const [marked, setMarked] = useState<Set<number>>(
    () => new Set(readJSON<Saved | null>(STORAGE_KEY, null)?.marked ?? []),
  );
  const [showWin, setShowWin] = useState(false);

  const win = hasLine(marked);
  const hasProgress = marked.size > 0 && !win;

  useEffect(() => {
    writeJSON<Saved>(STORAGE_KEY, { items, marked: [...marked] });
  }, [items, marked]);

  // If the app reopens onto a card that was already won (e.g. closed right
  // after the winning tap, before the overlay's delay fired), show it
  // silently instead of leaving the board locked with no explanation.
  useEffect(() => {
    if (win) setShowWin(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function deck() {
    setItems(deal());
    setMarked(new Set());
    setShowWin(false);
  }

  const restart = useConfirmArm(deck);

  function toggle(i: number) {
    if (win) return;
    const next = new Set(marked);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    const justWon = !hasLine(marked) && hasLine(next);
    setMarked(next);
    if (justWon) {
      sfx.win();
      setTimeout(() => setShowWin(true), 700);
    } else {
      sfx.tap();
    }
  }

  return (
    <ActivityChrome
      accent="var(--tomato)"
      toolbar={
        <button
          className={`iconBtn press ${restart.armed ? "iconBtn--armed" : ""}`}
          onClick={() => (hasProgress ? restart.trigger() : deck())}
          aria-label={restart.armed ? "Tap again for a new card" : "New card"}
        >
          <Icon name="refresh" size={20} />
        </button>
      }
    >
      <div className="bingo">
        <div className="bingo__board sheet" role="group" aria-label="Bingo card">
          {items.map((id, i) => {
            const item = POOL.find((p) => p.id === id)!;
            const on = marked.has(i);
            return (
              <button
                key={i}
                className={`bingo__cell ${on ? "bingo__cell--on" : ""} ${win?.includes(i) ? "bingo__cell--win" : ""}`}
                onClick={() => toggle(i)}
                aria-pressed={on}
                aria-label={`${item.label}${on ? ", found" : ""}`}
              >
                <Icon name={item.icon} size="46%" strokeWidth={2.2} />
                <span className="bingo__label">{item.label}</span>
                {on && (
                  <span className="bingo__mark pop">
                    <Icon name="check" size="60%" strokeWidth={3.4} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      {showWin && (
        <Celebrate
          icon="sparkle"
          accent="var(--tomato)"
          title="Bingo!"
          text="Three in a row."
          actions={
            <button className="btn btn--accent" style={{ "--accent": "var(--tomato)" } as React.CSSProperties} onClick={deck}>
              New card
            </button>
          }
        />
      )}
    </ActivityChrome>
  );
}
