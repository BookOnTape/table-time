import { useEffect, useRef, useState } from "react";
import type { ActivityProps } from "../types";
import { ActivityChrome } from "@/components/ActivityChrome";
import { Crayon, CrayonCup } from "@/components/Crayon";
import { Icon } from "@/components/Icon";
import { sfx } from "@/lib/sound";
import "./style.css";

const COLORS = [
  { hex: "#16162a", name: "Ink" },
  { hex: "#f0563a", name: "Tomato" },
  { hex: "#f4b62b", name: "Marigold" },
  { hex: "#2dae6c", name: "Leaf" },
  { hex: "#2e6be6", name: "Cobalt" },
  { hex: "#7a5ae0", name: "Plum" },
  { hex: "#ef6aa6", name: "Bubblegum" },
  { hex: "#4fb3e8", name: "Sky" },
];
const SIZES = [6, 14, 28];
const ERASER = "#ffffff";

export default function DoodlePad(_: ActivityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState(COLORS[4].hex);
  const [size, setSize] = useState(SIZES[1]);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  // Size the canvas to its container at device pixel ratio and preserve the
  // drawing across resizes (rotation, split view).
  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ro = new ResizeObserver(() => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = wrap.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const snapshot = document.createElement("canvas");
      snapshot.width = canvas.width;
      snapshot.height = canvas.height;
      snapshot.getContext("2d")?.drawImage(canvas, 0, 0);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const ctx = canvas.getContext("2d")!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, width, height);
      if (snapshot.width && snapshot.height) {
        ctx.drawImage(snapshot, 0, 0, snapshot.width / dpr, snapshot.height / dpr);
      }
    });
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function down(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    const p = pos(e);
    last.current = p;
    const ctx = e.currentTarget.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || !last.current) return;
    const p = pos(e);
    const ctx = e.currentTarget.getContext("2d")!;
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  }

  function up() {
    drawing.current = false;
    last.current = null;
  }

  function clear() {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    sfx.pop();
  }

  return (
    <ActivityChrome
      accent="var(--marigold)"
      toolbar={
        <>
          <div className="doodle__sizes" role="radiogroup" aria-label="Brush size">
            {SIZES.map((s) => (
              <button
                key={s}
                role="radio"
                aria-checked={size === s}
                aria-label={`Brush size ${s}`}
                className={`doodle__size press ${size === s ? "doodle__size--on" : ""}`}
                onClick={() => setSize(s)}
              >
                <span style={{ width: s * 0.75 + 4, height: s * 0.75 + 4 }} />
              </button>
            ))}
          </div>
          <button className="btn btn--quiet doodle__clear" onClick={clear}>
            <Icon name="trash" size={18} /> Clear
          </button>
        </>
      }
    >
      <div className="doodle">
        <div className="doodle__sheet sheet" ref={wrapRef}>
          <canvas
            ref={canvasRef}
            className="doodle__canvas"
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            onPointerLeave={up}
            aria-label="Drawing canvas"
          />
        </div>
        <CrayonCup label="Crayons">
          {COLORS.map((c) => (
            <Crayon
              key={c.hex}
              color={c.hex}
              selected={color === c.hex}
              ariaLabel={c.name}
              onClick={() => {
                setColor(c.hex);
                sfx.tap();
              }}
            />
          ))}
          <Crayon
            color={ERASER}
            outline
            selected={color === ERASER}
            ariaLabel="Eraser"
            label={<Icon name="eraser" size={16} />}
            onClick={() => {
              setColor(ERASER);
              sfx.tap();
            }}
          />
        </CrayonCup>
      </div>
    </ActivityChrome>
  );
}
