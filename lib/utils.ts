import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fixed locale so SSR and browser produce identical currency strings (avoids hydration mismatch). */
const USD_LOCALE = "en-US" as const;

export function formatUsd(n: number): string {
  return n.toLocaleString(USD_LOCALE, { style: "currency", currency: "USD" });
}

/** Matches public pages: centered column + horizontal padding. */
export const siteContentClass = "mx-auto w-full max-w-7xl px-6";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
