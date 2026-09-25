export type Locale = "es" | "en";

export type View =
  | "home"
  | "account"
  | "promos"
  | "rewards"
  | "invite"
  | "vip"
  | "reels"
  | "wheel"
  | "cards"
  | "details"
  | "bets"
  | "bonuses"
  | "support"
  | "language"
  | "profile"
  | "deposit"
  | "withdraw"
  | "crash"
  | "plinko"
  | "dice"
  | "mines"
  | "safari";

export type PayMethod = "paypal" | "chime" | "card" | "ach" | "venmo";

export const PAY_METHODS: { id: PayMethod; label: string }[] = [
  { id: "paypal", label: "PayPal" },
  { id: "chime", label: "Chime" },
  { id: "card", label: "Card" },
  { id: "ach", label: "ACH" },
  { id: "venmo", label: "Venmo" },
];

export type LedgerKind = "bet" | "win" | "bonus" | "daily" | "mission" | "vault" | "invite" | "code" | "topup";

export type LedgerItem = {
  id: string;
  kind: LedgerKind;
  game?: string;
  amount: number;
  note: string;
  at: number;
};

export type MissionId = "play5" | "win3" | "wager5k" | "visitVip";

export type MissionState = {
  id: MissionId;
  progress: number;
  target: number;
  claimed: boolean;
};

export type Vault = {
  amount: number;
  unlockAt: number;
};

export type Profile = {
  id: string;
  name: string;
  identifier: string;
  secret: string;
  authed: boolean;
  ageOk: boolean;
  chips: number;
  vault: Vault | null;
  vipXp: number;
  createdAt: number;
  lastDailyAt: number;
  streak: number;
  locale: Locale;
  inviteCode: string;
  usedInvite: boolean;
  sound: boolean;
  usedCodes: string[];
  missionsDay: string;
  missions: MissionState[];
  ledger: LedgerItem[];
  payMethod: PayMethod;
};

export type State = {
  ready: boolean;
  view: View;
  profile: Profile | null;
};

export const VIP_THRESHOLDS = [0, 800, 2500, 7000, 16000, 32000, 64000, 120000];

export const VIP_NAMES = {
  es: ["Invitado", "Bronce", "Plata", "Oro", "Platino", "Diamante", "Corona", "Imperial"],
  en: ["Guest", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Crown", "Imperial"],
} as const;

export const STARTER_CHIPS = 25_000;
export const VAULT_YIELD = 0.03;
export const VAULT_HOURS = 12;
