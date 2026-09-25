let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function beep(freq: number, dur: number, type: OscillatorType, gain = 0.06, delay = 0) {
  const audio = ac();
  if (!audio) return;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = 0.0001;
  osc.connect(g);
  g.connect(audio.destination);
  const t0 = audio.currentTime + delay;
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

export const sfx = {
  click() {
    beep(880, 0.07, "triangle", 0.04);
  },
  chip() {
    beep(420, 0.08, "square", 0.03);
    beep(640, 0.05, "triangle", 0.02, 0.04);
  },
  spin() {
    beep(220, 0.18, "sawtooth", 0.03);
    beep(330, 0.16, "triangle", 0.025, 0.08);
    beep(440, 0.14, "triangle", 0.02, 0.16);
  },
  win() {
    beep(523, 0.12, "sine", 0.06);
    beep(659, 0.12, "sine", 0.055, 0.08);
    beep(784, 0.18, "sine", 0.07, 0.16);
    beep(1046, 0.22, "triangle", 0.05, 0.26);
  },
  lose() {
    beep(196, 0.22, "sine", 0.05);
    beep(147, 0.28, "triangle", 0.04, 0.1);
  },
  bonus() {
    beep(698, 0.1, "triangle", 0.05);
    beep(880, 0.12, "sine", 0.05, 0.08);
    beep(1174, 0.2, "sine", 0.06, 0.16);
  },
};

export function buzz(ms = 12) {
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
}
