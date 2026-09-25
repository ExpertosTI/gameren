"use client";

import type { ReactNode } from "react";
import { formatChips } from "@/lib/logic";
import { VIP_NAMES, VIP_THRESHOLDS, type View } from "@/lib/types";
import { useClub } from "@/lib/store";

export function Chip({ n, size = "md" }: { n: number; size?: "sm" | "md" }) {
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${size === "sm" ? "text-sm" : "text-base"}`}>
      <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-yellow-700 text-[11px] text-amber-950">
        G
      </span>
      {formatChips(n)}
    </span>
  );
}

export function Screen({
  title,
  back = "account",
  children,
}: {
  title: string;
  back?: View;
  children: ReactNode;
}) {
  const { go, tr } = useClub();
  return (
    <section className="safe-bottom px-4 pt-4">
      <button className="mb-3 text-sm text-[var(--gold)]" onClick={() => go(back)}>
        ← {tr("back")}
      </button>
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl gold-text">{title}</h1>
      <div className="mt-4 space-y-3">{children}</div>
    </section>
  );
}

export function Row({
  label,
  onClick,
  trailing,
}: {
  label: string;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="glass flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left"
    >
      <span>{label}</span>
      <span className="text-[var(--muted)]">{trailing ?? "›"}</span>
    </button>
  );
}

export function VipPill() {
  const { profile } = useClub();
  const level = Math.max(
    0,
    VIP_THRESHOLDS.filter((n) => profile.vipXp >= n).length - 1,
  );
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-black/20 px-3 py-1 text-xs text-[var(--gold-2)]">
      <img src="/brand/vip.png" alt="" className="h-5 w-5 rounded-full object-cover" />
      VIP {level} · {VIP_NAMES[profile.locale][level]}
    </span>
  );
}

export function ToastHost() {
  const { toast } = useClub();
  if (!toast) return null;
  return <div className="toast glass rounded-2xl px-4 py-3 text-center text-sm">{toast.text}</div>;
}
