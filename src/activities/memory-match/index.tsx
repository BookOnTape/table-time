import { useEffect, useMemo, useState } from "react";
import type { ActivityProps } from "../types";
import { ActivityChrome, Readout } from "@/components/ActivityChrome";
import { Segmented } from "@/components/Segmented";
import { Celebrate } from "@/components/Celebrate";
import { Icon, type IconName } from "@/components/Icon";
import { readJSON, writeJSON } from "@/lib/storage";
import { sfx } from "@/lib/sound";
import "./style.css";

type Level = "easy" | "medium" | "hard";

const LEVELS: Record<Level, { pairs: number; cols: number; label: string; stars: number }> = {
  easy: { pairs: 3, cols: 3, label: "Easy", stars: 1 },
  medium: { pairs: 6, cols: 4, label: "Medium", stars: 2 },
  hard: { pairs: 8, cols: 4, label: "Hard", stars: 3 },
};

/** Each face is a glyph in a crayon color, so pairs match on shape and color. */
const FACES: { icon: IconName; color: string }[] = [
  { icon: "star", color: "var(--marigold)" },
  { icon: "heart", color: "var(--tomato)" },
  { icon: "moon", color: "var(--plum)" },
  { icon: "cloud", color: "var(--sky)" },
  { icon: "leaf", color: "var(--leaf)" },
  { icon: "bolt", color: "var(--marigold)" },
  { icon: "sun", color: "var(--tomato)" },
  { icon: "drop", color: "var(--cobalt)" },
  { icon: "rocket", color: "var(--cobalt)" },
  { icon: "fish", color: "var(--sky)" },
  { icon: "butterfly", color: "var(--bubblegum)" },
  { icon: "icecream", color: "var(--bubblegum)" },
];

interface Card {
  key: number;
  face: number;
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
  const faces = shuffle(FACES.map((_, i) => i)).slice(0, LEVELS[level].pairs);
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
  const [showWin, setShowWin] = useState(false);

  function restart(next: Level = level) {
    setLevel(next);
    setCards(deal(next));
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
    setLocked(false);
    setShowWin(false);
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
        // Skip the match pop when this pair finishes the board: the win
        // fanfare owns the climax, so it isn't masked by the pop's tone.
        if (matched.size + 2 < cards.length) sfx.pop();
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
    // Delay the overlay so the last flip and matched-card glow are visible
    // before it covers the board.
    const t = setTimeout(() => setShowWin(true), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [won]);

  const cols = LEVELS[level].cols;
  const style = useMemo(() => ({ "--cols": cols }) as React.CSSProperties, [cols]);

  return (
    <ActivityChrome
      accent="var(--plum)"
      toolbar={
        <>
          <Segmented
            label="Difficulty"
            value={level}
            onChange={(l) => restart(l)}
            options={(Object.keys(LEVELS) as Level[]).map((l) => ({
              value: l,
              label: (
                <>
                  {Array.from({ length: LEVELS[l].stars }).map((_, i) => (
                    <Icon key={i} name="star" size={11} />
                  ))}
                  {LEVELS[l].label}
                </>
              ),
            }))}
          />
          <Readout label="Moves">{moves}</Readout>
        </>
      }
    >
      <div className="mm" style={style}>
        {cards.map((c) => {
          const up = flipped.includes(c.key) || matched.has(c.key);
          const face = FACES[c.face];
          return (
            <button
              key={c.key}
              className={`mm__card ${up ? "mm__card--up" : ""} ${matched.has(c.key) ? "mm__card--matched" : ""}`}
              onClick={() => flip(c.key)}
              aria-label={up ? face.icon : "Hidden card"}
              disabled={matched.has(c.key)}
            >
              <span className="mm__inner">
                <span className="mm__back" />
                <span className="mm__face" style={{ color: face.color }}>
                  <Icon name={face.icon} size="54%" />
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {showWin && (
        <Celebrate
          icon="trophy"
          accent="var(--plum)"
          title="All matched."
          text={`${moves} moves${best !== null && moves <= best ? " · a new best" : best !== null ? ` · best is ${best}` : ""}`}
          actions={
            <>
              <button className="btn btn--accent" style={{ "--accent": "var(--plum)" } as React.CSSProperties} onClick={() => restart()}>
                Play again
              </button>
              {level !== "hard" && (
                <button className="btn btn--paper" onClick={() => restart(level === "easy" ? "medium" : "hard")}>
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
