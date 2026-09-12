import { useEffect, useRef, useState } from "react";
import type { ActivityProps } from "../types";
import { ActivityChrome, Readout } from "@/components/ActivityChrome";
import { Segmented } from "@/components/Segmented";
import { sfx } from "@/lib/sound";
import "./style.css";

interface Bubble {
  id: number;
  x: number; // percent
  size: number; // px
  hue: number;
  duration: number; // seconds
  popped?: boolean;
}

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
        return [
          ...list,
          {
            id: nextId.current++,
            x: 6 + Math.random() * 84,
            size: 56 + Math.random() * 52,
            hue: [8, 42, 150, 222, 258, 330][Math.floor(Math.random() * 6)],
            duration: (speed === "slow" ? 6 : 4) + Math.random() * 3,
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
      accent="var(--sky)"
      toolbar={
        <>
          <Segmented
            label="Speed"
            value={speed}
            onChange={setSpeed}
            options={[
              { value: "slow", label: "Slow" },
              { value: "fast", label: "Fast" },
            ]}
          />
          <Readout label="Popped">{score}</Readout>
        </>
      }
    >
      <div className="bp sheet" aria-label="Bubble field">
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
            <span className="bp__skin" />
          </button>
        ))}
        {score === 0 && bubbles.length === 0 && <p className="bp__hint">Tap the bubbles before they float away.</p>}
      </div>
    </ActivityChrome>
  );
}
