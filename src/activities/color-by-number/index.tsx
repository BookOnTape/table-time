import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ActivityProps } from "../types";
import { ActivityChrome, Pill } from "@/components/ActivityChrome";
import { Celebrate } from "@/components/Celebrate";
import { readJSON, removeKey, writeJSON } from "@/lib/storage";
import { sfx } from "@/lib/sound";
import { colorByNumberScenes, getScene } from "./scenes";
import "./style.css";

type Mode = "number" | "free";
type Fills = Record<string, string>;

const storageKey = (sceneId: string) => `progress:cbn:${sceneId}`;

export default function ColorByNumber({ variantId }: ActivityProps) {
  const scene = getScene(variantId) ?? colorByNumberScenes[0];
  const [mode, setMode] = useState<Mode>("number");
  const [selected, setSelected] = useState<number>(scene.palette[0].n);
  const [fills, setFills] = useState<Fills>(() => readJSON<Fills>(storageKey(scene.id), {}));
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [dismissedWin, setDismissedWin] = useState(false);

  useEffect(() => {
    writeJSON(storageKey(scene.id), fills);
  }, [fills, scene.id]);

  const colorOf = useMemo(() => new Map(scene.palette.map((p) => [p.n, p.color])), [scene]);

  const correctCount = scene.regions.filter((r) => fills[r.id] === colorOf.get(r.n)).length;
  const filledCount = scene.regions.filter((r) => fills[r.id]).length;
  const total = scene.regions.length;
  const complete = mode === "number" ? correctCount === total : filledCount === total;

  function tapRegion(regionId: string, n: number) {
    const color = colorOf.get(selected)!;
    if (mode === "number" && selected !== n) {
      sfx.nope();
      setWrongId(regionId);
      setTimeout(() => setWrongId((w) => (w === regionId ? null : w)), 350);
      return;
    }
    sfx.tap();
    setFills((f) => ({ ...f, [regionId]: color }));
  }

  function reset() {
    setFills({});
    removeKey(storageKey(scene.id));
    setDismissedWin(false);
  }

  useEffect(() => {
    if (complete && !dismissedWin) sfx.win();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complete]);

  return (
    <ActivityChrome
      accent={scene.accent}
      toolbar={
        <>
          <Pill active={mode === "number"} onClick={() => setMode("number")}>
            By number
          </Pill>
          <Pill active={mode === "free"} onClick={() => setMode("free")}>
            Any color
          </Pill>
          <span className="cbn__progress">
            {mode === "number" ? correctCount : filledCount}/{total}
          </span>
          <button className="cbn__reset press" onClick={reset} aria-label="Start over">
            ↺
          </button>
        </>
      }
    >
      <div className="cbn">
        <div className="cbn__canvasWrap">
          <svg className="cbn__svg" viewBox="0 0 400 400" role="img" aria-label={`${scene.title} coloring page`}>
            {scene.regions.map((r) => {
              const fill = fills[r.id];
              const hinted = mode === "number" && !fill && r.n === selected;
              return (
                <path
                  key={r.id}
                  d={r.d}
                  fill={fill ?? "#ffffff"}
                  className={`cbn__region ${hinted ? "cbn__region--hint" : ""} ${wrongId === r.id ? "cbn__region--wrong" : ""}`}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    tapRegion(r.id, r.n);
                  }}
                />
              );
            })}
            {scene.decor?.map((d, i) => (
              <path key={i} d={d.d} stroke={d.stroke} strokeWidth={d.width} fill="none" strokeLinecap="round" pointerEvents="none" />
            ))}
            {scene.regions.map((r) =>
              fills[r.id] ? null : (
                <text key={`t${r.id}`} x={r.lx} y={r.ly} className="cbn__label" pointerEvents="none">
                  {mode === "number" ? r.n : ""}
                </text>
              ),
            )}
          </svg>
        </div>

        <div className="cbn__palette" role="radiogroup" aria-label="Colors">
          {scene.palette.map((p) => {
            const remaining = scene.regions.filter((r) => r.n === p.n && fills[r.id] !== p.color).length;
            const done = mode === "number" && remaining === 0;
            return (
              <button
                key={p.n}
                role="radio"
                aria-checked={selected === p.n}
                aria-label={`${p.name}, number ${p.n}`}
                className={`cbn__swatch press ${selected === p.n ? "cbn__swatch--on" : ""} ${done ? "cbn__swatch--done" : ""}`}
                style={{ background: p.color }}
                onClick={() => {
                  setSelected(p.n);
                  sfx.tap();
                }}
              >
                <span className="cbn__swatchNum">{mode === "number" ? (done ? "✓" : p.n) : ""}</span>
              </button>
            );
          })}
        </div>
      </div>

      {complete && !dismissedWin && (
        <Celebrate
          emoji="🎉"
          title="Beautiful!"
          text={`You finished the ${scene.title.toLowerCase()}.`}
          actions={
            <>
              <button className="bigButton bigButton--secondary" onClick={reset}>
                Color again
              </button>
              <Link className="bigButton" to="/section/coloring" style={{ background: scene.accent }}>
                More pictures
              </Link>
              <button className="bigButton bigButton--secondary" onClick={() => setDismissedWin(true)}>
                Keep looking
              </button>
            </>
          }
        />
      )}
    </ActivityChrome>
  );
}
