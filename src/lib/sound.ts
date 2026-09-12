/**
 * Tiny WebAudio synth for tap/pop/win feedback. No audio files, so it works
 * offline and adds nothing to the bundle. Respects the parent's sound toggle
 * via `setSoundEnabled`.
 */
let ctx: AudioContext | null = null;
let enabled = true;

export function setSoundEnabled(v: boolean) {
  enabled = v;
}

function getCtx(): AudioContext | null {
  if (!enabled) return null;
  if (typeof window === "undefined" || !("AudioContext" in window)) return null;
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = "sine", gain = 0.08) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

export const sfx = {
  tap: () => tone(660, 0.08, "triangle"),
  pop: () => {
    const ac = getCtx();
    if (!ac) return;
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.12);
    g.gain.setValueAtTime(0.12, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.14);
    osc.connect(g).connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.15);
  },
  nope: () => tone(180, 0.18, "square", 0.05),
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.22, "triangle", 0.1), i * 110));
  },
};
