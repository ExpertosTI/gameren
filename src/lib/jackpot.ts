const KEY = "luxa.jackpot.v1";
const BASE = 86_400;
const FLOOR = 48_000;

export function readJackpot() {
  if (typeof window === "undefined") return BASE;
  try {
    const n = Number(localStorage.getItem(KEY));
    return Number.isFinite(n) && n > 0 ? n : BASE;
  } catch {
    return BASE;
  }
}

export function writeJackpot(n: number) {
  try {
    localStorage.setItem(KEY, String(Math.max(FLOOR, Math.round(n))));
  } catch {
    /* ignore */
  }
}

export function tickJackpot(current: number) {
  return current + 9 + Math.floor(Math.random() * 28);
}

export function feedJackpot(current: number, bet: number) {
  return current + Math.max(12, Math.round(bet * 0.06));
}

export function hitJackpot(current: number) {
  const win = current;
  writeJackpot(FLOOR + Math.floor(Math.random() * 12_000));
  return win;
}
