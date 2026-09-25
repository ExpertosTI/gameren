"use client";

import dynamic from "next/dynamic";

const fallback = <div className="h-64 w-full animate-pulse rounded-3xl bg-[#10182a]" />;

export const Lobby3D = dynamic(() => import("./LobbyView"), { ssr: false, loading: () => fallback });
export const Reels3D = dynamic(() => import("./ReelsView"), { ssr: false, loading: () => fallback });
export const Wheel3D = dynamic(() => import("./WheelView"), { ssr: false, loading: () => fallback });
export const Cards3D = dynamic(() => import("./CardsView"), { ssr: false, loading: () => fallback });
