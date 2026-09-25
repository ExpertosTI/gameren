"use client";

import { CardsGame, ReelsGame, WheelGame } from "./games";
import { SafariGame } from "./SafariGame";
import { WinBanner } from "./WinBanner";
import { CrashGame, DiceGame, MinesGame, PlinkoGame } from "./extra-games";
import { useState } from "react";
import { AuthScreen } from "./Auth";
import { ChatFab } from "./LiveChat";
import { InstallBar } from "./Pwa";
import { ToastHost } from "./ui";
import { WelcomeGate } from "./Welcome";
import {
  AccountView,
  BetsView,
  BonusesView,
  DetailsView,
  HomeView,
  InviteView,
  LanguageView,
  ProfileView,
  PromosView,
  RewardsView,
  SupportView,
  VipView,
} from "./views";
import { DepositView, WithdrawView } from "./Wallet";
import { useClub } from "@/lib/store";
import type { View } from "@/lib/types";

const NAV: { view: View; key: "invite" | "promos" | "home" | "rewards" | "account"; icon: string }[] = [
  { view: "invite", key: "invite", icon: "✦" },
  { view: "promos", key: "promos", icon: "▣" },
  { view: "home", key: "home", icon: "⌂" },
  { view: "rewards", key: "rewards", icon: "♔" },
  { view: "account", key: "account", icon: "◉" },
];

function ScreenSwitch() {
  const { view } = useClub();
  switch (view) {
    case "home":
      return <HomeView />;
    case "account":
      return <AccountView />;
    case "vip":
      return <VipView />;
    case "promos":
      return <PromosView />;
    case "rewards":
      return <RewardsView />;
    case "invite":
      return <InviteView />;
    case "reels":
      return <ReelsGame />;
    case "wheel":
      return <WheelGame />;
    case "cards":
      return <CardsGame />;
    case "details":
      return <DetailsView />;
    case "bets":
      return <BetsView />;
    case "bonuses":
      return <BonusesView />;
    case "support":
      return <SupportView />;
    case "language":
      return <LanguageView />;
    case "profile":
      return <ProfileView />;
    case "deposit":
      return <DepositView />;
    case "withdraw":
      return <WithdrawView />;
    case "crash":
      return <CrashGame />;
    case "plinko":
      return <PlinkoGame />;
    case "dice":
      return <DiceGame />;
    case "mines":
      return <MinesGame />;
    case "safari":
      return <SafariGame />;
    default:
      return <HomeView />;
  }
}

export function CasinoApp() {
  const { ready, view, go, tr, profile } = useClub();
  const [door, setDoor] = useState<"welcome" | "auth">("welcome");
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  if (!ready) {
    return (
      <div className="app-shell grid place-items-center">
        <img src="/brand/icon.png" alt="" className="h-20 w-20 rounded-full object-cover floaty" />
        <p className="mt-4 font-[family-name:var(--font-playfair)] text-3xl gold-text">LUXA</p>
      </div>
    );
  }

  if (!profile.authed) {
    return (
      <div className="app-shell">
        <InstallBar />
        {door === "welcome" ? (
          <WelcomeGate
            onLogin={() => {
              setAuthMode("login");
              setDoor("auth");
            }}
            onRegister={() => {
              setAuthMode("register");
              setDoor("auth");
            }}
          />
        ) : (
          <AuthScreen startMode={authMode} onBack={() => setDoor("welcome")} />
        )}
        <ToastHost />
        <WinBanner />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <InstallBar />
      <ScreenSwitch />
      <nav className="nav-safe glass fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 rounded-t-3xl px-2 pt-2">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active =
              view === item.view ||
              (item.view === "home" && ["reels", "wheel", "cards", "vip", "crash", "plinko", "dice", "mines", "safari"].includes(view));
            return (
              <button
                key={item.view}
                onClick={() => go(item.view)}
                className={`flex flex-col items-center gap-1 py-2 text-[11px] ${active ? "text-[var(--gold)]" : "text-[var(--muted)]"}`}
              >
                <span className={`grid h-10 w-10 place-items-center rounded-full ${item.view === "home" ? "btn-gold text-lg" : "text-lg"}`}>
                  {item.icon}
                </span>
                {tr(item.key)}
              </button>
            );
          })}
        </div>
      </nav>
      {view !== "support" && <ChatFab />}
      <ToastHost />
      <WinBanner />
    </div>
  );
}
