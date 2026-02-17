import { format, formatDistanceToNow, parseISO } from "date-fns";

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return format(parseISO(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | null | undefined): string {
  if (!date) return "—";
  return format(parseISO(date), "MMM d, yyyy h:mm a");
}

export function formatRelative(date: string | null | undefined): string {
  if (!date) return "—";
  return formatDistanceToNow(parseISO(date), { addSuffix: true });
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function moodColor(score: number): string {
  if (score <= 2) return "text-red-500";
  if (score <= 4) return "text-orange-500";
  if (score <= 6) return "text-amber-500";
  if (score <= 8) return "text-green-500";
  return "text-emerald-500";
}

export function moodBgColor(score: number): string {
  if (score <= 2) return "bg-red-500";
  if (score <= 4) return "bg-orange-500";
  if (score <= 6) return "bg-amber-500";
  if (score <= 8) return "bg-green-500";
  return "bg-emerald-500";
}
