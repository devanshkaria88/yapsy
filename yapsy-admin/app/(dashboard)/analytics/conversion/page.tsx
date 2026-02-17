"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import type { ConversionFunnel } from "@/lib/types";

interface FunnelStep {
  name: string;
  count: number;
  color: string;
}

export default function ConversionPage() {
  const { data, isLoading } = useApiQuery<ConversionFunnel>(
    ["analytics", "conversion-funnel"],
    "/analytics/conversion-funnel",
    undefined,
    { staleTime: 60_000 }
  );

  const funnel = data?.data;

  const steps: FunnelStep[] = funnel
    ? [
        { name: "Registered", count: funnel.registered, color: "bg-primary" },
        {
          name: "First Check-in",
          count: funnel.first_check_in,
          color: "bg-primary/70",
        },
        { name: "Pro Subscriber", count: funnel.pro, color: "bg-emerald-500" },
      ]
    : [];

  const maxCount = steps[0]?.count || 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Conversion Funnel
        </h2>
        <p className="text-sm text-muted-foreground">
          User journey from signup to subscription
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Funnel</CardTitle>
          <CardDescription>
            Drop-off at each step of the conversion process
            {funnel
              ? ` — ${funnel.conversion_rate.toFixed(1)}% overall conversion`
              : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : steps.length ? (
            <div className="space-y-4">
              {steps.map((step, index) => {
                const widthPct = (step.count / maxCount) * 100;
                const dropOff =
                  index > 0
                    ? (
                        ((steps[index - 1].count - step.count) /
                          steps[index - 1].count) *
                        100
                      ).toFixed(1)
                    : null;

                return (
                  <div key={step.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">
                          {step.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">
                          {formatNumber(step.count)}
                        </span>
                        {dropOff && Number(dropOff) > 0 && (
                          <span className="text-xs text-red-500">
                            -{dropOff}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-8 w-full rounded-lg bg-muted">
                      <div
                        className={cn("h-8 rounded-lg transition-all", step.color)}
                        style={{ width: `${Math.max(widthPct, 2)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No funnel data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
