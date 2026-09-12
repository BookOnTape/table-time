import { useEffect, useState } from "react";
import type { ActivityProps } from "../types";
import { ActivityChrome } from "@/components/ActivityChrome";
import { Segmented } from "@/components/Segmented";
import { Celebrate } from "@/components/Celebrate";
import { Icon } from "@/components/Icon";
import { sfx } from "@/lib/sound";
import "./style.css";

type Mark = "X" | "O";
type Cell = Mark | null;
type Opponent = "human" | "robot";

const COLOR: Record<Mark, string> = { X: "var(--tomato)", O: "var(--cobalt)" };
const NAME: Record<Mark, string> = { X: "Red", O: "Blue" };
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function winner(b: Cell[]): { mark: Mark; line: number[] } | null {
  for (const line of LINES) {
    const [a, b2, c] = line;
    if (b[a] && b[a] === b[b2] && b[a] === b[c]) return { mark: b[a]!, line };
  }
  return null;
}

/** Win if possible, block if needed, usually take center, else random. */
function robotMove(b: Cell[]): number {
  const open = b.map((c, i) => (c === null ? i : -1)).filter((i) => i >= 0);
  for (const mark of ["O", "X"] as Mark[]) {
    for (const i of open) {
      const trial = [...b];
      trial[i] = mark;
      if (winner(trial)?.mark === mark) return i;
    }
  }
  if (open.includes(4) && Math.random() < 0.8) return 4;
  return open[Math.floor(Math.random() * open.length)];
}

export default function TicTacToe(_: ActivityProps) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Mark>("X");
  const [opponent, setOpponent] = useState<Opponent>("human");

  const win = winner(board);
  const full = board.every(Boolean);
  const over = !!win || full;

  function play(i: number) {
    if (board[i] || over) return;
    if (opponent === "robot" && turn === "O") return;
    sfx.tap();
    const next = [...board];
    next[i] = turn;
    setBoard(next);
    setTurn(turn === "X" ? "O" : "X");
  }

  useEffect(() => {
    if (opponent !== "robot" || turn !== "O" || over) return;
    const t = setTimeout(() => {
      setBoard((b) => {
        const i = robotMove(b);
        const next = [...b];
        next[i] = "O";
        return next;
      });
      setTurn("X");
      sfx.tap();
    }, 550);
    return () => clearTimeout(t);
  }, [turn, opponent, over]);

  useEffect(() => {
    if (win) sfx.win();
    else if (full) sfx.pop();
  }, [win, full]);

  function reset(next: Opponent = opponent) {
    setOpponent(next);
    setBoard(Array(9).fill(null));
    setTurn("X");
  }

  return (
    <ActivityChrome
      accent="var(--leaf)"
      toolbar={
        <Segmented
          label="Opponent"
          value={opponent}
          onChange={(o) => reset(o)}
          options={[
            { value: "human", label: <><Icon name="people" size={18} /> Two players</> },
            { value: "robot", label: <><Icon name="robot" size={18} /> Robot</> },
          ]}
        />
      }
    >
      <div className="ttt">
        <div className="ttt__turn" aria-live="polite">
          {!over && (
            <>
              <span className="ttt__chip" style={{ color: COLOR[turn] }}>
                <Icon name={turn === "X" ? "x" : "o"} size={20} strokeWidth={3.2} />
              </span>
              {opponent === "robot" && turn === "O" ? "Robot is thinking…" : `${NAME[turn]}'s turn`}
            </>
          )}
        </div>
        <div className="ttt__board sheet" role="grid" aria-label="Tic tac toe board">
          {board.map((c, i) => (
            <button
              key={i}
              role="gridcell"
              className={`ttt__cell ${win?.line.includes(i) ? "ttt__cell--win" : ""}`}
              onClick={() => play(i)}
              aria-label={c ? NAME[c] : `Empty square ${i + 1}`}
              disabled={!!c || over}
              style={c ? { color: COLOR[c] } : undefined}
            >
              {c && (
                <span className="pop">
                  <Icon name={c === "X" ? "x" : "o"} size="62%" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
        <button className="btn btn--quiet ttt__reset" onClick={() => reset()}>
          <Icon name="undo" size={18} /> New game
        </button>
      </div>
      {over && (
        <Celebrate
          icon={win ? (win.mark === "X" ? "x" : "o") : "people"}
          accent={win ? COLOR[win.mark] : "var(--ink)"}
          title={win ? `${NAME[win.mark]} wins.` : "It's a tie."}
          text={win ? "Three in a row." : "Nobody got three in a row."}
          actions={
            <button className="btn btn--accent" style={{ "--accent": "var(--leaf)" } as React.CSSProperties} onClick={() => reset()}>
              Play again
            </button>
          }
        />
      )}
    </ActivityChrome>
  );
}
