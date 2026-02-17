"use client";

import {
  Server,
  Database,
  Mic,
  CreditCard,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useApiQuery } from "@/hooks/use-api";
import {
  serviceStatusColor,
  serviceStatusText,
} from "@/lib/badge-helpers";
import type { HealthStatus, ServiceStatus } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  name: string;
  status: ServiceStatus;
  icon: LucideIcon;
}

function ServiceCard({ name, status, icon: Icon }: ServiceCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className="rounded-lg bg-muted p-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {serviceStatusText(status)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-3 w-3 rounded-full",
              serviceStatusColor(status),
              status === "healthy" ? "" : "animate-pulse"
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

type ServiceKey = "api" | "database" | "elevenlabs" | "razorpay";

const services: { name: string; key: ServiceKey; icon: LucideIcon }[] = [
  { name: "API Server", key: "api", icon: Server },
  { name: "Database", key: "database", icon: Database },
  { name: "ElevenLabs", key: "elevenlabs", icon: Mic },
  { name: "Razorpay", key: "razorpay", icon: CreditCard },
];

export default function SystemHealthPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useApiQuery<HealthStatus>(
    ["system", "health"],
    "/system/health",
    undefined,
    { staleTime: 10_000 }
  );

  const health = data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Health</h2>
          <p className="text-sm text-muted-foreground">
            Monitor service status and uptime
            {health && (
              <span className="ml-2 inline-flex items-center gap-1">
                <Clock className="inline h-3 w-3" />
                Uptime: {formatUptime(health.uptime)}
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["system", "health"] })
          }
        >
          <RefreshCw className="mr-1 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-4 p-6">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-3 w-3 rounded-full" />
                </CardContent>
              </Card>
            ))
          : health &&
            services.map((svc) => (
              <ServiceCard
                key={svc.key}
                name={svc.name}
                status={health[svc.key]}
                icon={svc.icon}
              />
            ))}
      </div>
    </div>
  );
}
