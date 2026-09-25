export type InstallEvent = Event & {
  prompt: () => Promise<void>;
  userChoice?: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __luxaBIP?: InstallEvent | null;
  }
}

export const BIP_SCRIPT = `window.__luxaBIP=window.__luxaBIP||null;window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();window.__luxaBIP=e;window.dispatchEvent(new Event("luxa-can-install"));});`;

export function readInstallEvent(): InstallEvent | null {
  if (typeof window === "undefined") return null;
  return window.__luxaBIP ?? null;
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function isAppleMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}
