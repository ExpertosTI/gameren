import {
  STARTER_CHIPS,
  VIP_THRESHOLDS,
  type LedgerItem,
  type MissionState,
  type Profile,
} from "./types";

export function uid(prefix = "g"): string {
  return `${prefix}${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export function dayKey(ts = Date.now()): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function freshMissions(): MissionState[] {
  return [
    { id: "play5", progress: 0, target: 5, claimed: false },
    { id: "win3", progress: 0, target: 3, claimed: false },
    { id: "wager5k", progress: 0, target: 5000, claimed: false },
    { id: "visitVip", progress: 0, target: 1, claimed: false },
  ];
}

export function newProfile(): Profile {
  return {
    id: uid("u"),
    name: "",
    identifier: "",
    secret: "",
    authed: false,
    ageOk: false,
    chips: STARTER_CHIPS,
    vault: null,
    vipXp: 0,
    createdAt: Date.now(),
    lastDailyAt: 0,
    streak: 0,
    locale: "es",
    inviteCode: uid("GR").toUpperCase().slice(0, 8),
    usedInvite: false,
    sound: true,
    usedCodes: [],
    missionsDay: dayKey(),
    missions: freshMissions(),
    payMethod: "paypal",
    ledger: [
      {
        id: uid("l"),
        kind: "bonus",
        amount: STARTER_CHIPS,
        note: "welcome",
        at: Date.now(),
      },
    ],
  };
}

export function vipLevel(xp: number): number {
  let level = 0;
  for (let i = 0; i < VIP_THRESHOLDS.length; i++) {
    if (xp >= VIP_THRESHOLDS[i]) level = i;
  }
  return level;
}

export function vipMult(xp: number): number {
  return 1 + vipLevel(xp) * 0.08;
}

export function dailyReady(profile: Profile, now = Date.now()): boolean {
  if (!profile.lastDailyAt) return true;
  return dayKey(profile.lastDailyAt) !== dayKey(now);
}

export function dailyAmount(profile: Profile): number {
  const streak = dailyReady(profile) ? Math.min(profile.streak + 1, 14) : profile.streak;
  return Math.round(1800 * (1 + streak * 0.12) * vipMult(profile.vipXp));
}

export function formatChips(n: number): string {
  return new Intl.NumberFormat("en-US").format(Math.max(0, Math.floor(n)));
}

export function addLedger(profile: Profile, item: Omit<LedgerItem, "id" | "at">): Profile {
  const row: LedgerItem = { ...item, id: uid("l"), at: Date.now() };
  return { ...profile, ledger: [row, ...profile.ledger].slice(0, 120) };
}

export function withMission(
  profile: Profile,
  id: MissionState["id"],
  add: number,
): Profile {
  const missions = (profile.missions ?? []).map((m) =>
    m.id === id ? { ...m, progress: Math.min(m.target, m.progress + add) } : m,
  );
  return { ...profile, missions };
}

export function afterRound(profile: Profile, wager: number, won: boolean): Profile {
  let next = { ...profile, vipXp: profile.vipXp + wager };
  next = withMission(next, "play5", 1);
  next = withMission(next, "wager5k", wager);
  if (won) next = withMission(next, "win3", 1);
  return next;
}

export const REEL_SYMBOLS = ["star", "crown", "gem", "moon", "fox"] as const;
export type ReelSymbol = (typeof REEL_SYMBOLS)[number];

const REEL_WEIGHTS: Record<ReelSymbol, number> = {
  star: 8,
  crown: 12,
  gem: 16,
  moon: 22,
  fox: 28,
};

const REEL_PAY: Record<ReelSymbol, number> = {
  star: 28,
  crown: 16,
  gem: 10,
  moon: 6,
  fox: 4,
};

export function pickSymbol(): ReelSymbol {
  const bag = REEL_SYMBOLS.flatMap((s) => Array(REEL_WEIGHTS[s]).fill(s));
  return bag[Math.floor(Math.random() * bag.length)];
}

export function spinReels(): [ReelSymbol, ReelSymbol, ReelSymbol] {
  return [pickSymbol(), pickSymbol(), pickSymbol()];
}

export function reelsPayout(reels: ReelSymbol[], bet: number): number {
  const [a, b, c] = reels;
  if (a === b && b === c) return bet * REEL_PAY[a];
  if (a === b || b === c || a === c) {
    const pair = a === b || a === c ? a : b;
    return Math.round(bet * (REEL_PAY[pair] * 0.18));
  }
  return 0;
}

export const ROULETTE_REDS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

export type WheelBet = { kind: "red" | "black" | "green" | "number"; value?: number };

export function spinWheel(): number {
  return Math.floor(Math.random() * 37);
}

export function wheelPayout(n: number, bet: WheelBet, amount: number): number {
  if (bet.kind === "green") return n === 0 ? amount * 18 : 0;
  if (bet.kind === "number") return n === bet.value ? amount * 35 : 0;
  if (n === 0) return 0;
  const red = ROULETTE_REDS.has(n);
  if (bet.kind === "red") return red ? amount * 2 : 0;
  return !red ? amount * 2 : 0;
}

export type Suit = "C" | "D" | "H" | "S";
export type Rank = "A" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K";
export type Card = { suit: Suit; rank: Rank };

const SUITS: Suit[] = ["C", "D", "H", "S"];
const RANKS: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

export function drawCard(): Card {
  return {
    suit: SUITS[Math.floor(Math.random() * SUITS.length)],
    rank: RANKS[Math.floor(Math.random() * RANKS.length)],
  };
}

export function handValue(cards: Card[]): number {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    if (card.rank === "A") {
      aces += 1;
      total += 11;
    } else if (["K", "Q", "J"].includes(card.rank)) {
      total += 10;
    } else {
      total += Number(card.rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

export const CODES: Record<string, number> = {
  LUXA: 8000,
  GAMEREN: 8000,
  SALON: 4000,
  VELVET: 5500,
  CORONA: 6500,
};

export function missionReward(id: MissionState["id"]): number {
  if (id === "play5") return 1200;
  if (id === "win3") return 2200;
  if (id === "wager5k") return 1800;
  return 900;
}
