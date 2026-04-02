import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBRL(n: number): string {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}

/** True when a media URL is set (non-empty string) */
export function hasMediaUrl(s: string | undefined | null): s is string {
  return typeof s === "string" && s.trim().length > 0;
}
