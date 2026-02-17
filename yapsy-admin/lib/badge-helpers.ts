import type { SubscriptionStatus, ServiceStatus } from "@/lib/types";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function subscriptionBadgeVariant(status: SubscriptionStatus): BadgeVariant {
  switch (status) {
    case "pro":
      return "default";
    case "free":
      return "outline";
    case "cancelled":
      return "destructive";
    case "paused":
      return "secondary";
    case "past_due":
      return "destructive";
    default:
      return "outline";
  }
}

export function serviceStatusColor(status: ServiceStatus): string {
  switch (status) {
    case "healthy":
      return "bg-emerald-500";
    case "degraded":
      return "bg-amber-500";
    case "down":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export function serviceStatusText(status: ServiceStatus): string {
  switch (status) {
    case "healthy":
      return "Healthy";
    case "degraded":
      return "Degraded";
    case "down":
      return "Down";
    default:
      return "Unknown";
  }
}
