"use client";

export type BannerKind = "jackpot" | "big" | "win" | "lose";

export type BannerDetail = {
  kind: BannerKind;
  title: string;
  sub?: string;
};

export function showBanner(detail: BannerDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<BannerDetail>("luxa-banner", { detail }));
  if (detail.kind !== "lose") void burst(detail.kind);
}

export async function burst(kind: BannerKind | "chip" = "win") {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  const gold = ["#fff4d6", "#e8c891", "#c9a15a", "#f6e6c3", "#8a6420"];
  void confetti({
    particleCount: kind === "jackpot" ? 160 : kind === "big" ? 110 : 70,
    spread: kind === "jackpot" ? 90 : 70,
    startVelocity: kind === "jackpot" ? 48 : 34,
    origin: { y: 0.45 },
    colors: gold,
    ticks: 240,
    gravity: 0.9,
    scalar: kind === "jackpot" ? 1.2 : 0.95,
    zIndex: 90,
    disableForReducedMotion: true,
  });
}
