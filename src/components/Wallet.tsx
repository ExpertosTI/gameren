"use client";

import { useState } from "react";
import { formatChips } from "@/lib/logic";
import { useClub } from "@/lib/store";
import { PAY_METHODS, type PayMethod } from "@/lib/types";
import { Screen } from "./ui";

const PACKS = [2000, 5000, 10000, 25000];

function MethodList({ value, onChange }: { value: PayMethod; onChange: (m: PayMethod) => void }) {
  const { tr } = useClub();
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <p className="px-4 pt-3 text-xs text-[var(--muted)]">{tr("chooseMethod")}</p>
      {PAY_METHODS.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`flex w-full items-center justify-between border-t border-[var(--line)] px-4 py-4 text-left ${value === m.id ? "text-[var(--gold)]" : ""}`}
        >
          <span>{m.label}</span>
          <span>{value === m.id ? "●" : "○"}</span>
        </button>
      ))}
    </div>
  );
}

export function DepositView() {
  const { tr, profile, setPayMethod, topUp } = useClub();
  const [amount, setAmount] = useState(5000);

  return (
    <Screen title={tr("deposit")} back="account">
      <div className="rounded-2xl border border-amber-200/20 bg-amber-100/5 px-4 py-3 text-xs leading-5 text-amber-100/80">
        ⚠ {tr("payWarn")}
      </div>
      <label className="block text-sm text-[var(--muted)]">{tr("holder")}</label>
      <div className="field">
        <span>👤</span>
        <input readOnly value={profile.name || tr("guest")} />
      </div>
      <MethodList value={profile.payMethod} onChange={setPayMethod} />
      <div className="grid grid-cols-2 gap-2">
        {PACKS.map((n) => (
          <button key={n} className={`rounded-2xl py-3 ${amount === n ? "btn-gold" : "btn-ghost"}`} onClick={() => setAmount(n)}>
            {formatChips(n)}
          </button>
        ))}
      </div>
      <button className="btn-gold h-12 w-full rounded-2xl" onClick={() => topUp(amount, profile.payMethod)}>
        {tr("confirmTopup")} · {PAY_METHODS.find((m) => m.id === profile.payMethod)?.label}
      </button>
    </Screen>
  );
}

export function WithdrawView() {
  const { tr, profile, setPayMethod, lockVault } = useClub();
  const [amount, setAmount] = useState(2000);

  return (
    <Screen title={tr("bindTitle")} back="account">
      <div className="rounded-2xl border border-amber-200/20 bg-amber-100/5 px-4 py-3 text-xs leading-5 text-amber-100/80">
        ⚠ {tr("payWarn")}
      </div>
      <p className="text-sm text-[var(--muted)]">{tr("withdrawHint")}</p>
      <label className="block text-sm text-[var(--muted)]">{tr("holder")}</label>
      <div className="field">
        <span>👤</span>
        <input readOnly value={profile.name || tr("guest")} />
      </div>
      <p className="text-sm">{tr("payMethod")}</p>
      <MethodList value={profile.payMethod} onChange={setPayMethod} />
      <input
        type="range"
        min={1000}
        max={Math.max(1000, profile.chips)}
        step={500}
        value={Math.min(amount, profile.chips)}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button className="btn-gold h-12 w-full rounded-2xl" onClick={() => lockVault(amount)}>
        {tr("withdraw")} · {formatChips(amount)}
      </button>
    </Screen>
  );
}
