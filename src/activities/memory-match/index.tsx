import { useEffect, useMemo, useState } from "react";
import type { ActivityProps } from "../types";
import { ActivityChrome, Pill } from "@/components/ActivityChrome";
import { Celebrate } from "@/components/Celebrate";
import { readJSON, writeJSON } from "@/lib/storage";
import { sfx } from "@/lib/sound";
import "./style.css";

type Level = "easy" | "medium" | "hard";

const LEVELS: Record<Level, { pairs: number; cols: number; label: string }> = {
  easy: { pairs: 3, cols: 3, label: "Easy" },
  medium: { pairs: 6, cols: 4, label: "Medium" },
  hard: { pairs: 8, cols: 4, label: "Hard" },
};

const EMOJI = ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐙", "🦄"];

interface Card {
  key: number;
  face: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function deal(level: Level): Card[] {
  const faces = shuffle(EMOJI).slice(0, LEVELS[level].pairs);
  return shuffle([...faces, ...faces]).map((face, key) => ({ key, face }));
}

export default function MemoryMatch(_: ActivityProps) {
  const [level, setLevel] = useState<Level>("easy");
  const [cards, setCards] = useState<Card[]>(() => deal("easy"));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const bestKey = `progress:memory:${level}`;
  const best = readJSON<number | null>(bestKey, null);
  const won = matched.size === cards.length;

  function restart(next: Level = level) {
    setLevel(next);
    setCards(deal(next));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
  }

  function flip(key: number) {
    if (locked || flipped.includes(key) || matched.has(key)) return;
    sfx.tap();
    const next = [...flipped, key];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next.map((k) => cards[k].face);
      if (a === b) {
        sfx.pop();
        setMatched((m) => new Set([...m, ...next]));
        setFlipped([]);
      } else {
        setLocked(true);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 750);
      }
    }
  }

  useEffect(() => {
    if (!won) return;
    sfx.win();
    if (best === null || moves < best) writeJSON(bestKey, moves);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const cols = LEVELS[level].cols;
  const style = useMemo(() => ({ "--cols": cols }) as React.CSSProperties, [cols]);

  return (
    <ActivityChrome
      accent="var(--purple)"
      toolbar={
        <>
          {(Object.keys(LEVELS) as Level[]).map((l) => (
            <Pill key={l} active={level === l} onClick={() => restart(l)}>
              {LEVELS[l].label}
            </Pill>
          ))}
          <span className="mm__moves">Moves: {moves}</span>
        </>
      }
    >
      <div className="mm" style={style}>
        {cards.map((c) => {
          const up = flipped.includes(c.key) || matched.has(c.key);
          return (
            <button
              key={c.key}
              className={`mm__card ${up ? "mm__card--up" : ""} ${matched.has(c.key) ? "mm__card--matched" : ""}`}
              onClick={() => flip(c.key)}
              aria-label={up ? c.face : "Hidden card"}
              disabled={matched.has(c.key)}
            >
              <span className="mm__inner">
                <span className="mm__back">?</span>
                <span className="mm__face">{c.face}</span>
              </span>
            </button>
          );
        })}
      </div>
      {won && (
        <Celebrate
          emoji="🏆"
          title="You found them all!"
          text={`${moves} moves${best !== null && moves <= best ? " · new best!" : best !== null ? ` · best is ${best}` : ""}`}
          actions={
            <>
              <button className="bigButton" style={{ background: "var(--purple)" }} onClick={() => restart()}>
                Play again
              </button>
              {level !== "hard" && (
                <button
                  className="bigButton bigButton--secondary"
                  onClick={() => restart(level === "easy" ? "medium" : "hard")}
                >
                  Harder
                </button>
              )}
            </>
          }
        />
      )}
    </ActivityChrome>
  );
}
