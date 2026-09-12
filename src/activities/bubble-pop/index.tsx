import { useEffect, useRef, useState } from "react";
import type { ActivityProps } from "../types";
import { ActivityChrome, Pill } from "@/components/ActivityChrome";
import { sfx } from "@/lib/sound";
import "./style.css";

interface Bubble {
  id: number;
  x: number; // percent
  size: number; // px
  hue: number;
  duration: number; // seconds
  emoji?: string;
  popped?: boolean;
}

const EMOJI = ["⭐", "🐟", "🦆", "🍓", "🎈", "🐢", "🌈", "🍪"];

export default function BubblePop(_: ActivityProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState<"slow" | "fast">("slow");
  const nextId = useRef(1);

  useEffect(() => {
    const interval = speed === "slow" ? 900 : 520;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setBubbles((list) => {
        if (list.length > 14) return list;
        const size = 56 + Math.random() * 48;
        return [
          ...list,
          {
            id: nextId.current++,
            x: 5 + Math.random() * 85,
            size,
            hue: Math.floor(Math.random() * 360),
            duration: (speed === "slow" ? 6 : 4) + Math.random() * 3,
            emoji: Math.random() < 0.35 ? EMOJI[Math.floor(Math.random() * EMOJI.length)] : undefined,
          },
        ];
      });
    }, interval);
    return () => clearInterval(timer);
  }, [speed]);

  function pop(id: number) {
    setBubbles((list) => list.map((b) => (b.id === id && !b.popped ? { ...b, popped: true } : b)));
    setScore((s) => s + 1);
    sfx.pop();
    setTimeout(() => setBubbles((list) => list.filter((b) => b.id !== id)), 260);
  }

  function escaped(id: number) {
    setBubbles((list) => list.filter((b) => b.id !== id));
  }

  return (
    <ActivityChrome
      accent="var(--teal)"
      toolbar={
        <>
          <Pill active={speed === "slow"} onClick={() => setSpeed("slow")}>
            🐢 Slow
          </Pill>
          <Pill active={speed === "fast"} onClick={() => setSpeed("fast")}>
            🐇 Fast
          </Pill>
          <span className="bp__score" aria-live="polite">
            🫧 {score}
          </span>
        </>
      }
    >
      <div className="bp" aria-label="Bubble field">
        {bubbles.map((b) => (
          <button
            key={b.id}
            className={`bp__bubble ${b.popped ? "bp__bubble--popped" : ""}`}
            style={
              {
                left: `${b.x}%`,
                width: b.size,
                height: b.size,
                "--hue": b.hue,
                animationDuration: `${b.duration}s`,
              } as React.CSSProperties
            }
            onPointerDown={() => pop(b.id)}
            onAnimationEnd={(e) => {
              if (e.animationName === "bpRise") escaped(b.id);
            }}
            aria-label="Bubble"
          >
            <span className="bp__skin">{b.emoji}</span>
          </button>
        ))}
        {score === 0 && bubbles.length === 0 && <p className="bp__hint">Tap the bubbles!</p>}
      </div>
    </ActivityChrome>
  );
}
