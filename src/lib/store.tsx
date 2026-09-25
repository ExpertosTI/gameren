"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { buzz, sfx } from "./audio";
import { burst } from "./fx";
import { t, type Msg } from "./i18n";
import {
  CODES,
  addLedger,
  afterRound,
  dailyAmount,
  dailyReady,
  dayKey,
  freshMissions,
  missionReward,
  newProfile,
  vipLevel,
  withMission,
} from "./logic";
import { VAULT_HOURS, VAULT_YIELD, type Locale, type PayMethod, type Profile, type View } from "./types";

const KEY = "luxa.club.v2";
const USERS = "luxa.users.v2";

type Toast = { id: number; text: string };

type Club = {
  ready: boolean;
  view: View;
  profile: Profile;
  toast: Toast | null;
  go: (view: View) => void;
  tr: (key: Msg) => string;
  setName: (name: string) => void;
  setLocale: (locale: Locale) => void;
  toggleSound: () => void;
  claimDaily: () => void;
  claimMission: (id: Profile["missions"][number]["id"]) => void;
  redeem: (code: string) => void;
  useInvite: (code: string) => void;
  lockVault: (amount: number) => void;
  unlockVault: () => void;
  playRound: (wager: number, payout: number, game: string, note: string) => boolean;
  login: (id: string, pass: string) => boolean;
  register: (name: string, id: string, pass: string, age: boolean) => boolean;
  recover: (id: string, pass: string) => boolean;
  signOut: () => void;
  setPayMethod: (method: PayMethod) => void;
  topUp: (amount: number, method: PayMethod) => void;
  reset: () => void;
  ping: (kind?: keyof typeof sfx) => void;
};

const ClubContext = createContext<Club | null>(null);

export const DEMO_USER = "demo";
export const DEMO_PASS = "luxa1234";

function demoAccount(): Profile {
  return {
    ...newProfile(),
    name: "Demo",
    identifier: DEMO_USER,
    secret: DEMO_PASS,
    authed: false,
    ageOk: true,
    id: "udemo",
  };
}

function readUsers(): Record<string, Profile> {
  try {
    const map = JSON.parse(localStorage.getItem(USERS) || "{}") as Record<string, Profile>;
    if (!map[DEMO_USER]) map[DEMO_USER] = demoAccount();
    return map;
  } catch {
    return { [DEMO_USER]: demoAccount() };
  }
}

function persist(profile: Profile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
  if (profile.identifier) {
    const map = readUsers();
    map[profile.identifier] = profile;
    localStorage.setItem(USERS, JSON.stringify(map));
  }
}

function patch(p: Profile): Profile {
  return {
    ...newProfile(),
    ...p,
    identifier: p.identifier ?? "",
    secret: p.secret ?? "",
    authed: Boolean(p.authed),
    ageOk: Boolean(p.ageOk),
    payMethod: p.payMethod ?? "paypal",
  };
}

function hydrate(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return newProfile();
    const parsed = patch(JSON.parse(raw) as Profile);
    if (!parsed.id || typeof parsed.chips !== "number") return newProfile();
    const today = dayKey();
    if (parsed.missionsDay !== today) {
      parsed.missionsDay = today;
      parsed.missions = freshMissions();
    }
    return parsed;
  } catch {
    return newProfile();
  }
}

export function ClubProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>("home");
  const [profile, setProfile] = useState<Profile>(newProfile);
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    setProfile(hydrate());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) persist(profile);
  }, [profile, ready]);

  const flash = (text: string) => {
    const id = Date.now();
    setToast({ id, text });
    window.setTimeout(() => setToast((cur) => (cur?.id === id ? null : cur)), 2200);
  };

  const ping = (kind: keyof typeof sfx = "click") => {
    if (kind === "win" || kind === "bonus") void burst(kind === "bonus" ? "big" : "win");
    if (!profile.sound) return;
    sfx[kind]();
    buzz(kind === "win" || kind === "bonus" ? 24 : 10);
  };

  const mutate = (fn: (p: Profile) => Profile) => setProfile((p) => fn(p));

  const value = useMemo<Club>(() => {
    return {
      ready,
      view,
      profile,
      toast,
      go(next) {
        ping("click");
        if (next === "vip") mutate((p) => withMission(p, "visitVip", 1));
        setView(next);
      },
      tr: (key) => t(profile.locale, key),
      setName(name) {
        mutate((p) => ({ ...p, name: name.trim().slice(0, 24) }));
      },
      setLocale(locale) {
        mutate((p) => ({ ...p, locale }));
      },
      toggleSound() {
        mutate((p) => ({ ...p, sound: !p.sound }));
      },
      login(id, pass) {
        const key = id.trim().toLowerCase();
        const found = readUsers()[key];
        if (!found || found.secret !== pass) {
          flash(t(profile.locale, "loginFail"));
          ping("lose");
          return false;
        }
        ping("bonus");
        setProfile(patch({ ...found, authed: true }));
        setView("home");
        return true;
      },
      register(name, id, pass, age) {
        const key = id.trim().toLowerCase();
        if (!age) {
          flash(t(profile.locale, "needAge"));
          return false;
        }
        if (!name.trim() || !key || pass.length < 4) {
          flash(t(profile.locale, "needFields"));
          return false;
        }
        if (readUsers()[key]) {
          flash(t(profile.locale, "loginFail"));
          return false;
        }
        ping("bonus");
        let extra = 0;
        try {
          extra = Number(sessionStorage.getItem("luxa.welcome.g") || 0);
          sessionStorage.removeItem("luxa.welcome.g");
        } catch {
          extra = 0;
        }
        if (!Number.isFinite(extra) || extra < 0) extra = 0;
        const base = newProfile();
        const fresh = {
          ...base,
          name: name.trim().slice(0, 24),
          identifier: key,
          secret: pass,
          authed: true,
          ageOk: true,
          locale: profile.locale,
          chips: base.chips + extra,
        };
        setProfile(
          extra
            ? addLedger(fresh, { kind: "bonus", amount: extra, note: "welcome-spin" })
            : fresh,
        );
        setView("home");
        return true;
      },
      recover(id, pass) {
        const key = id.trim().toLowerCase();
        const map = readUsers();
        if (!map[key] || pass.length < 4) {
          flash(t(profile.locale, "loginFail"));
          return false;
        }
        map[key] = { ...map[key], secret: pass };
        localStorage.setItem(USERS, JSON.stringify(map));
        flash(t(profile.locale, "codeOk"));
        return true;
      },
      signOut() {
        mutate((p) => ({ ...p, authed: false }));
        setView("home");
      },
      setPayMethod(method) {
        mutate((p) => ({ ...p, payMethod: method }));
      },
      topUp(amount, method) {
        mutate((p) => {
          ping("bonus");
          flash(t(p.locale, "topupOk"));
          return addLedger(
            { ...p, chips: p.chips + amount, payMethod: method },
            { kind: "topup", amount, note: method },
          );
        });
      },
      claimDaily() {
        mutate((p) => {
          if (!dailyReady(p)) return p;
          const amount = dailyAmount(p);
          const streak = dayKey(p.lastDailyAt) === dayKey(Date.now() - 86400000) ? Math.min(p.streak + 1, 14) : 1;
          ping("bonus");
          flash(t(p.locale, "codeOk"));
          return addLedger(
            { ...p, chips: p.chips + amount, lastDailyAt: Date.now(), streak },
            { kind: "daily", amount, note: `streak-${streak}` },
          );
        });
      },
      claimMission(id) {
        mutate((p) => {
          const mission = p.missions.find((m) => m.id === id);
          if (!mission || mission.claimed || mission.progress < mission.target) return p;
          const amount = Math.round(missionReward(id) * (1 + vipLevel(p.vipXp) * 0.05));
          ping("bonus");
          return addLedger(
            {
              ...p,
              chips: p.chips + amount,
              missions: p.missions.map((m) => (m.id === id ? { ...m, claimed: true } : m)),
            },
            { kind: "mission", amount, note: id },
          );
        });
      },
      redeem(code) {
        const key = code.trim().toUpperCase();
        mutate((p) => {
          const amount = CODES[key];
          if (!amount || p.usedCodes.includes(key)) {
            flash(t(p.locale, "codeBad"));
            ping("lose");
            return p;
          }
          ping("bonus");
          flash(t(p.locale, "codeOk"));
          return addLedger(
            { ...p, chips: p.chips + amount, usedCodes: [...p.usedCodes, key] },
            { kind: "code", amount, note: key },
          );
        });
      },
      useInvite(code) {
        mutate((p) => {
          const clean = code.trim().toUpperCase();
          if (p.usedInvite || !clean || clean === p.inviteCode) {
            flash(t(p.locale, "codeBad"));
            return p;
          }
          ping("bonus");
          flash(t(p.locale, "inviteOk"));
          return addLedger({ ...p, chips: p.chips + 3500, usedInvite: true }, { kind: "invite", amount: 3500, note: clean });
        });
      },
      lockVault(amount) {
        mutate((p) => {
          const n = Math.floor(amount);
          if (p.vault || n < 1000 || n > p.chips) {
            flash(t(p.locale, "vaultNeed"));
            return p;
          }
          ping("chip");
          return addLedger(
            { ...p, chips: p.chips - n, vault: { amount: n, unlockAt: Date.now() + VAULT_HOURS * 3600_000 } },
            { kind: "vault", amount: -n, note: "lock" },
          );
        });
      },
      unlockVault() {
        mutate((p) => {
          if (!p.vault) return p;
          if (Date.now() < p.vault.unlockAt) {
            flash(t(p.locale, "vaultWait"));
            return p;
          }
          const back = Math.round(p.vault.amount * (1 + VAULT_YIELD));
          ping("bonus");
          return addLedger({ ...p, chips: p.chips + back, vault: null }, { kind: "vault", amount: back, note: "unlock" });
        });
      },
      playRound(wager, payout, game, note) {
        if (wager > profile.chips || wager <= 0) {
          flash(t(profile.locale, "notEnough"));
          ping("lose");
          return false;
        }
        mutate((p) => {
          const won = payout > wager;
          const nextChips = p.chips - wager + payout;
          let next = afterRound({ ...p, chips: nextChips }, wager, payout > 0 && won);
          next = addLedger(next, { kind: "bet", game, amount: -wager, note });
          if (payout > 0) next = addLedger(next, { kind: "win", game, amount: payout, note });
          return next;
        });
        ping(payout > wager ? "win" : payout > 0 ? "chip" : "lose");
        return true;
      },
      reset() {
        if (!window.confirm(t(profile.locale, "resetConfirm"))) return;
        const fresh = newProfile();
        fresh.locale = profile.locale;
        setProfile(fresh);
        setView("home");
      },
      ping,
    };
  }, [ready, view, profile, toast]);

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub() {
  const ctx = useContext(ClubContext);
  if (!ctx) throw new Error("useClub");
  return ctx;
}
