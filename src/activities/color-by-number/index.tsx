import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { ActivityProps } from "../types";
import { ActivityChrome, Readout } from "@/components/ActivityChrome";
import { Segmented } from "@/components/Segmented";
import { Crayon, CrayonCup } from "@/components/Crayon";
import { Celebrate } from "@/components/Celebrate";
import { Icon } from "@/components/Icon";
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
          <Segmented
            label="Coloring mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "number", label: "By number" },
              { value: "free", label: "Any color" },
            ]}
          />
          <Readout>
            {mode === "number" ? correctCount : filledCount}
            <span className="cbn__of">/{total}</span>
          </Readout>
          <button className="iconBtn press" onClick={reset} aria-label="Start over">
            <Icon name="undo" size={20} />
          </button>
        </>
      }
    >
      <div className="cbn">
        <div className="cbn__sheetWrap">
          <svg className="cbn__svg sheet" viewBox="0 0 400 400" role="img" aria-label={`${scene.title} coloring page`}>
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
              fills[r.id] || mode !== "number" ? null : (
                <text key={`t${r.id}`} x={r.lx} y={r.ly} className="cbn__label" pointerEvents="none">
                  {r.n}
                </text>
              ),
            )}
          </svg>
        </div>

        <CrayonCup label="Crayons">
          {scene.palette.map((p) => {
            const remaining = scene.regions.filter((r) => r.n === p.n && fills[r.id] !== p.color).length;
            const done = mode === "number" && remaining === 0;
            return (
              <Crayon
                key={p.n}
                color={p.color}
                selected={selected === p.n}
                done={done}
                ariaLabel={`${p.name}, number ${p.n}`}
                label={mode === "number" ? (done ? <Icon name="check" size={16} strokeWidth={3.2} /> : p.n) : null}
                onClick={() => {
                  setSelected(p.n);
                  sfx.tap();
                }}
              />
            );
          })}
        </CrayonCup>
      </div>

      {complete && !dismissedWin && (
        <Celebrate
          icon="sparkle"
          accent={scene.accent}
          title="Beautiful."
          text={`You finished the ${scene.title.toLowerCase()}.`}
          actions={
            <>
              <Link className="btn btn--accent" to="/section/coloring" style={{ "--accent": scene.accent } as React.CSSProperties}>
                More pictures
              </Link>
              <button className="btn btn--quiet" onClick={reset}>
                Color again
              </button>
              <button className="btn btn--quiet" onClick={() => setDismissedWin(true)}>
                Keep looking
              </button>
            </>
          }
        />
      )}
    </ActivityChrome>
  );
}
