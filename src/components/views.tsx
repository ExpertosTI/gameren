"use client";

import { useMemo, useState } from "react";
import { dailyAmount, dailyReady, formatChips, missionReward, vipLevel } from "@/lib/logic";
import { t } from "@/lib/i18n";
import { useClub } from "@/lib/store";
import { VIP_NAMES, VIP_THRESHOLDS, type LedgerKind, type MissionId, type View } from "@/lib/types";
import { JackpotBar } from "./JackpotBar";
import { ChatPanel } from "./LiveChat";
import { Chip, Row, Screen, VipPill } from "./ui";

function missionLabel(locale: "es" | "en", id: MissionId) {
  const map: Record<MissionId, "missionPlay" | "missionWin" | "missionWager" | "missionVip"> = {
    play5: "missionPlay",
    win3: "missionWin",
    wager5k: "missionWager",
    visitVip: "missionVip",
  };
  return t(locale, map[id]);
}

export function HomeView() {
  const { tr, go, profile } = useClub();
  const games = [
    { view: "safari" as View, title: tr("safari"), hint: tr("safariHint"), mark: "🦁🐯🦜" },
    { view: "reels" as View, title: tr("reels"), hint: tr("reelsHint"), mark: "✦✦✦" },
    { view: "wheel" as View, title: tr("wheel"), hint: tr("wheelHint"), mark: "◎" },
    { view: "cards" as View, title: tr("cards"), hint: tr("cardsHint"), mark: "A♠" },
    { view: "crash" as View, title: tr("crash"), hint: tr("crashHint"), mark: "↑" },
    { view: "plinko" as View, title: tr("plinko"), hint: tr("plinkoHint"), mark: "●" },
    { view: "dice" as View, title: tr("dice"), hint: tr("diceHint"), mark: "⚄" },
    { view: "mines" as View, title: tr("mines"), hint: tr("minesHint"), mark: "▣" },
  ];

  return (
    <section className="safe-bottom px-4 pt-5">
      <div className="relative overflow-hidden rounded-[28px] px-5 py-8">
        <img src="/assets/poker/table_top.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,20,.25),rgba(7,11,20,.7))]" />
        <div className="relative">
          <img src="/brand/icon.png" alt="" className="mx-auto h-16 w-16 rounded-full object-cover ring-2 ring-[var(--gold)]" />
          <p className="mt-3 text-center font-[family-name:var(--font-playfair)] text-3xl gold-text">{tr("brand")}</p>
          <p className="text-center text-sm text-[var(--gold-2)]">{tr("tag")}</p>
          <div className="mt-4 flex justify-center gap-3">
            <img src="/assets/poker/chip100.png" alt="" className="h-12 w-12 object-contain" />
            <img src="/assets/poker/chip500.png" alt="" className="h-12 w-12 object-contain" />
            <img src="/assets/poker/chip1000.png" alt="" className="h-12 w-12 object-contain" />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <JackpotBar onPlay={() => go("safari")} />
      </div>

      <div className="glass mt-4 rounded-3xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--muted)]">{tr("playable")}</p>
            <p className="mt-1 text-2xl">
              <Chip n={profile.chips} />
            </p>
          </div>
          <button className="btn-gold rounded-full px-4 py-2 text-sm" onClick={() => go("rewards")}>
            {tr("claim")}
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-playfair)] text-xl">{tr("featured")}</h2>
        <button className="text-sm text-[var(--gold)]" onClick={() => go("vip")}>
          {tr("vipClub")}
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {games.map((g) => (
          <button key={g.view} onClick={() => go(g.view)} className="glass w-full overflow-hidden rounded-3xl text-left">
            <div className="grid h-24 place-items-center bg-[linear-gradient(160deg,#1a1408,#0b1220)] text-4xl text-[var(--gold)]">
              {g.mark}
            </div>
            <div className="px-4 py-3">
              <p className="font-[family-name:var(--font-playfair)] text-lg">{g.title}</p>
              <p className="text-sm text-[var(--muted)]">{g.hint}</p>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-[var(--muted)]">{tr("playOnly")}</p>
    </section>
  );
}

export function AccountView() {
  const { tr, go, profile } = useClub();
  const vault = profile.vault?.amount ?? 0;

  return (
    <section className="safe-bottom px-4 pt-5">
      <div className="glass rounded-3xl p-4">
        <div className="flex items-center gap-3">
          <img src="/brand/avatar.png" alt="" className="h-14 w-14 rounded-full object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg font-semibold">{profile.name || tr("guest")}</p>
            <p className="text-xs text-[var(--muted)]">{profile.id}</p>
            <div className="mt-2">
              <VipPill />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-3xl bg-[linear-gradient(160deg,#102046,#0a1630_60%,#1a1408)] p-4">
        <p className="text-center text-sm text-[var(--gold-2)]">{tr("myBalance")}</p>
        <div className="mt-4 grid grid-cols-2 text-center">
          <div>
            <p className="text-xs text-[var(--muted)]">{tr("playable")}</p>
            <p className="mt-1 text-xl font-semibold">{formatChips(profile.chips)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">{tr("vaulted")}</p>
            <p className="mt-1 text-xl font-semibold">{formatChips(vault)}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="btn-gold h-11 rounded-full" onClick={() => go("deposit")}>
            {tr("deposit")}
          </button>
          <button className="btn-ghost h-11 rounded-full" onClick={() => go("withdraw")}>
            {tr("withdraw")}
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Row label={tr("details")} onClick={() => go("details")} />
        <Row label={tr("bets")} onClick={() => go("bets")} />
        <Row label={tr("profile")} onClick={() => go("profile")} />
        <Row label={tr("bonuses")} onClick={() => go("bonuses")} />
        <Row label={tr("deposit")} onClick={() => go("deposit")} />
        <Row label={tr("bindTitle")} onClick={() => go("withdraw")} />
        <Row label={tr("vault")} onClick={() => go("rewards")} />
        <Row label={tr("support")} onClick={() => go("support")} />
        <Row label={tr("language")} trailing={profile.locale === "es" ? "Español" : "English"} onClick={() => go("language")} />
      </div>
    </section>
  );
}

export function VipView() {
  const { tr, profile } = useClub();
  const level = vipLevel(profile.vipXp);
  const next = VIP_THRESHOLDS[Math.min(level + 1, VIP_THRESHOLDS.length - 1)];
  const prev = VIP_THRESHOLDS[level];
  const pct = level >= 7 ? 100 : Math.round(((profile.vipXp - prev) / Math.max(1, next - prev)) * 100);

  return (
    <Screen title={tr("vipClub")} back="home">
      <div className="glass overflow-hidden rounded-3xl">
        <img src="/brand/vip.png" alt="" className="mx-auto mt-5 h-28 w-28 rounded-full object-cover" />
        <div className="p-5 text-center">
          <p className="font-[family-name:var(--font-playfair)] text-3xl gold-text">
            {VIP_NAMES[profile.locale][level]}
          </p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {tr("level")} {level}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/30">
            <div className="h-full bg-gradient-to-r from-amber-200 to-yellow-600" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            {tr("nextVip")}: {formatChips(Math.max(0, next - profile.vipXp))} XP
          </p>
        </div>
      </div>
      <div className="glass rounded-3xl p-4 text-sm leading-6 text-[var(--gold-2)]">
        <p className="mb-2 font-semibold">{tr("vipPerks")}</p>
        <p>· Bono diario +{Math.round(vipLevel(profile.vipXp) * 8)}%</p>
        <p>· Misiones con recargo de rango</p>
        <p>· Acceso al salón y a la bóveda</p>
      </div>
    </Screen>
  );
}

export function RewardsView() {
  const { tr, profile, claimDaily, claimMission, redeem, lockVault, unlockVault } = useClub();
  const [code, setCode] = useState("");
  const [vaultAmt, setVaultAmt] = useState(2000);
  const ready = dailyReady(profile);

  return (
    <Screen title={tr("rewards")} back="home">
      <div className="glass rounded-3xl p-4">
        <p className="font-semibold">{ready ? tr("dailyReady") : tr("dailyWait")}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {tr("chips")}: {formatChips(dailyAmount(profile))} · streak {profile.streak}
        </p>
        <button className="btn-gold mt-3 h-11 w-full rounded-2xl disabled:opacity-40" disabled={!ready} onClick={claimDaily}>
          {tr("claimDaily")}
        </button>
      </div>

      <div className="glass rounded-3xl p-4">
        <p className="mb-3 font-semibold">{tr("missions")}</p>
        <div className="space-y-3">
          {profile.missions.map((m) => (
            <div key={m.id} className="rounded-2xl bg-black/20 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">{missionLabel(profile.locale, m.id)}</p>
                <Chip n={missionReward(m.id)} size="sm" />
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/30">
                <div
                  className="h-full bg-[var(--gold)]"
                  style={{ width: `${Math.min(100, (m.progress / m.target) * 100)}%` }}
                />
              </div>
              <button
                className="btn-ghost mt-2 h-9 w-full rounded-xl text-sm disabled:opacity-40"
                disabled={m.claimed || m.progress < m.target}
                onClick={() => claimMission(m.id)}
              >
                {m.claimed ? tr("claimed") : tr("claimMission")}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-4">
        <p className="font-semibold">{tr("codes")}</p>
        <div className="mt-3 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-11 flex-1 rounded-xl border border-[var(--line)] bg-black/20 px-3"
            placeholder="LUXA"
          />
          <button className="btn-gold rounded-xl px-4" onClick={() => redeem(code)}>
            {tr("apply")}
          </button>
        </div>
      </div>

      <div className="glass rounded-3xl p-4">
        <p className="font-semibold">{tr("vaultTitle")}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{tr("vaultBody")}</p>
        {profile.vault ? (
          <div className="mt-3">
            <p>
              <Chip n={profile.vault.amount} /> · {tr("vaultLocked")}{" "}
              {new Date(profile.vault.unlockAt).toLocaleTimeString()}
            </p>
            <button className="btn-gold mt-3 h-11 w-full rounded-2xl" onClick={unlockVault}>
              {tr("unlock")}
            </button>
          </div>
        ) : (
          <div className="mt-3">
            <input
              type="range"
              min={1000}
              max={Math.max(1000, profile.chips)}
              step={500}
              value={Math.min(vaultAmt, profile.chips)}
              onChange={(e) => setVaultAmt(Number(e.target.value))}
            />
            <button className="btn-ghost mt-2 h-11 w-full rounded-2xl" onClick={() => lockVault(vaultAmt)}>
              {tr("lock")} · {formatChips(vaultAmt)}
            </button>
          </div>
        )}
      </div>
    </Screen>
  );
}

export function InviteView() {
  const { tr, profile, useInvite } = useClub();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  return (
    <Screen title={tr("inviteTitle")} back="home">
      <p className="text-sm text-[var(--muted)]">{tr("inviteBody")}</p>
      <div className="glass rounded-3xl p-4">
        <p className="text-xs text-[var(--muted)]">{tr("yourCode")}</p>
        <p className="mt-1 font-[family-name:var(--font-playfair)] text-3xl gold-text">{profile.inviteCode}</p>
        <button
          className="btn-gold mt-3 h-11 w-full rounded-2xl"
          onClick={async () => {
            await navigator.clipboard.writeText(profile.inviteCode);
            setCopied(true);
          }}
        >
          {copied ? tr("copied") : tr("yourCode")}
        </button>
      </div>
      {!profile.usedInvite && (
        <div className="glass rounded-3xl p-4">
          <p className="text-sm">{tr("enterCode")}</p>
          <div className="mt-3 flex gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="h-11 flex-1 rounded-xl border border-[var(--line)] bg-black/20 px-3"
            />
            <button className="btn-gold rounded-xl px-4" onClick={() => useInvite(code)}>
              {tr("apply")}
            </button>
          </div>
        </div>
      )}
    </Screen>
  );
}

export function PromosView() {
  const { tr, go } = useClub();
  return (
    <Screen title={tr("promos")} back="home">
      <button className="glass overflow-hidden rounded-3xl text-left" onClick={() => go("rewards")}>
        <img src="/brand/hero.png" alt="" className="h-32 w-full object-cover" />
        <div className="p-4">
          <p className="font-[family-name:var(--font-playfair)] text-xl">{tr("dailyReady")}</p>
          <p className="text-sm text-[var(--muted)]">{tr("playOnly")}</p>
        </div>
      </button>
      <button className="glass overflow-hidden rounded-3xl text-left" onClick={() => go("vip")}>
        <img src="/brand/vip.png" alt="" className="h-32 w-full object-cover" />
        <div className="p-4">
          <p className="font-[family-name:var(--font-playfair)] text-xl">{tr("vipClub")}</p>
          <p className="text-sm text-[var(--muted)]">{tr("vipPerks")}</p>
        </div>
      </button>
    </Screen>
  );
}

function LedgerList({ kinds }: { kinds: LedgerKind[] }) {
  const { profile, tr } = useClub();
  const rows = useMemo(
    () => profile.ledger.filter((r) => kinds.includes(r.kind)),
    [profile.ledger, kinds],
  );
  if (!rows.length) return <p className="text-sm text-[var(--muted)]">{tr("empty")}</p>;
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="glass flex items-center justify-between rounded-2xl px-4 py-3">
          <div>
            <p className="text-sm capitalize">{r.game || r.kind}</p>
            <p className="text-xs text-[var(--muted)]">{new Date(r.at).toLocaleString()}</p>
          </div>
          <span className={r.amount >= 0 ? "text-emerald-300" : "text-rose-300"}>
            {r.amount >= 0 ? "+" : ""}
            {formatChips(r.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function DetailsView() {
  const { tr, profile } = useClub();
  return (
    <Screen title={tr("details")}>
      <Row label={tr("name")} trailing={profile.name || tr("guest")} />
      <Row label="ID" trailing={profile.id} />
      <Row label="VIP" trailing={String(vipLevel(profile.vipXp))} />
      <p className="text-xs text-[var(--muted)]">{tr("playOnly")}</p>
    </Screen>
  );
}

export function BetsView() {
  const { tr } = useClub();
  return (
    <Screen title={tr("bets")}>
      <LedgerList kinds={["bet", "win"]} />
    </Screen>
  );
}

export function BonusesView() {
  const { tr } = useClub();
  return (
    <Screen title={tr("bonuses")}>
      <LedgerList kinds={["bonus", "daily", "mission", "code", "invite", "vault", "topup"]} />
    </Screen>
  );
}

export function SupportView() {
  const { tr } = useClub();
  return (
    <Screen title={tr("support")}>
      <div className="glass rounded-3xl p-4">
        <ChatPanel />
      </div>
      <div className="glass rounded-3xl p-4">
        <p className="font-semibold">{tr("supportFaq1q")}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{tr("supportFaq1a")}</p>
      </div>
      <div className="glass rounded-3xl p-4">
        <p className="font-semibold">{tr("supportFaq2q")}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">{tr("supportFaq2a")}</p>
      </div>
    </Screen>
  );
}

export function LanguageView() {
  const { tr, profile, setLocale } = useClub();
  return (
    <Screen title={tr("language")}>
      <button className={`rounded-2xl px-4 py-4 ${profile.locale === "es" ? "btn-gold" : "btn-ghost"}`} onClick={() => setLocale("es")}>
        Español
      </button>
      <button className={`rounded-2xl px-4 py-4 ${profile.locale === "en" ? "btn-gold" : "btn-ghost"}`} onClick={() => setLocale("en")}>
        English
      </button>
    </Screen>
  );
}

export function ProfileView() {
  const { tr, profile, setName, toggleSound, signOut } = useClub();
  const [name, setLocal] = useState(profile.name);
  return (
    <Screen title={tr("profile")}>
      <label className="block text-sm text-[var(--muted)]">{tr("name")}</label>
      <input
        value={name}
        onChange={(e) => setLocal(e.target.value)}
        className="h-12 w-full rounded-2xl border border-[var(--line)] bg-black/20 px-3"
      />
      <button className="btn-gold h-11 w-full rounded-2xl" onClick={() => setName(name)}>
        {tr("save")}
      </button>
      <button className="btn-ghost h-11 w-full rounded-2xl" onClick={toggleSound}>
        {tr("sound")}: {profile.sound ? "ON" : "OFF"}
      </button>
      <button className="h-11 w-full rounded-2xl text-rose-300" onClick={signOut}>
        {tr("logout")}
      </button>
      <p className="text-xs text-[var(--muted)]">{tr("logoutHint")}</p>
    </Screen>
  );
}
