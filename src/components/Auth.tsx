"use client";

import { useState } from "react";
import { useClub } from "@/lib/store";

type Mode = "login" | "register" | "forgot";

export function AuthScreen({
  startMode = "login",
  onBack,
}: {
  startMode?: Mode;
  onBack?: () => void;
}) {
  const { tr, login, register, recover } = useClub();
  const [mode, setMode] = useState<Mode>(startMode);
  const [help, setHelp] = useState(false);
  const [id, setId] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [age, setAge] = useState(false);

  const title = mode === "register" ? tr("registerTitle") : mode === "forgot" ? tr("forgotTitle") : tr("loginTitle");

  const submit = () => {
    if (mode === "login") {
      if (!age) return;
      login(id, pass);
      return;
    }
    if (mode === "register") {
      register(name, id, pass, age);
      return;
    }
    recover(id, pass);
  };

  return (
    <div className="app-shell px-5 pt-4">
      <div className="flex items-center justify-center relative h-12">
        <button
          className="absolute left-0 text-xl text-[var(--gold-2)]"
          onClick={() => (onBack ? onBack() : setMode("login"))}
          aria-label={tr("back")}
        >
          ←
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="mt-8 grid place-items-center">
        <div className="relative">
          <div className="absolute inset-x-8 -top-8 h-24 rounded-full bg-[radial-gradient(circle,rgba(232,200,120,.35),transparent_70%)]" />
          <img src="/brand/icon.png" alt="LUXA" className="relative h-24 w-24 rounded-full object-cover ring-2 ring-[var(--gold)]" />
        </div>
        <p className="mt-3 font-[family-name:var(--font-playfair)] text-3xl gold-text">LUXA</p>
        <p className="mt-2 text-center text-xs text-[var(--muted)]">demo · luxa1234</p>
      </div>

      <div className="mt-10 space-y-3">
        {mode === "register" && (
          <label className="field">
            <span>◆</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={tr("name")} />
          </label>
        )}
        <label className="field">
          <span>👤</span>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder={tr("identifier")} autoComplete="username" />
        </label>
        <label className="field">
          <span>🔒</span>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder={tr("password")}
            type={show ? "text" : "password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="text-sm text-[var(--muted)]">
            {show ? "●" : "○"}
          </button>
        </label>
      </div>

      {mode === "login" && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-[var(--gold-2)]">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            {tr("remember")}
          </label>
          <button className="text-[var(--gold)] underline-offset-2" onClick={() => setMode("forgot")}>
            {tr("forgot")}
          </button>
        </div>
      )}

      {mode !== "forgot" && (
        <label className="mt-5 flex items-start gap-2 text-xs leading-5 text-[var(--muted)]">
          <input type="checkbox" className="mt-0.5" checked={age} onChange={(e) => setAge(e.target.checked)} />
          {tr("ageOk")}
        </label>
      )}

      <button className="btn-gold mt-6 h-12 w-full rounded-full text-base" onClick={submit}>
        {mode === "forgot" ? tr("resetPass") : mode === "register" ? tr("register") : tr("login")}
      </button>

      <p className="mt-5 text-center text-sm text-[var(--muted)]">
        {mode === "register" ? tr("hasAccount") : tr("noAccount")}{" "}
        <button className="text-[var(--gold)]" onClick={() => setMode(mode === "register" ? "login" : "register")}>
          {mode === "register" ? tr("login") : tr("register")}
        </button>
      </p>

      <p className="mt-8 text-center text-[11px] text-[var(--muted)]">{tr("playOnly")}</p>

      {help && (
        <div className="glass mt-6 rounded-3xl p-4 text-sm">
          <p className="font-semibold">{tr("supportFaq1q")}</p>
          <p className="mt-1 text-[var(--muted)]">{tr("supportFaq1a")}</p>
        </div>
      )}

      <button
        className="fixed bottom-6 left-[max(1.25rem,calc(50%-200px))] grid h-12 w-12 place-items-center rounded-full bg-[#1a4bff] text-white shadow-lg"
        onClick={() => setHelp((h) => !h)}
        aria-label={tr("supportChat")}
      >
        ◕
      </button>
    </div>
  );
}
