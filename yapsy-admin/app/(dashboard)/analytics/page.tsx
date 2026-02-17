"use client";

import { Clock, Users, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { useApiQuery } from "@/hooks/use-api";
import type { FeatureUsage } from "@/lib/types";

export default function AnalyticsOverviewPage() {
  const { data, isLoading } = useApiQuery<FeatureUsage>(
    ["analytics", "feature-usage"],
    "/analytics/feature-usage",
    undefined,
    { staleTime: 60_000 }
  );

  const usage = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Analytics Overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Feature usage and engagement metrics
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
                <Skeleton className="mt-2 h-3 w-40" />
              </CardContent>
            </Card>
          ))
        ) : usage ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Check-ins per User
                </CardTitle>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {usage.avg_check_ins_per_user.toFixed(1)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Average check-ins across all users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Duration
                </CardTitle>
                <div className={cn("rounded-lg p-2", "bg-emerald-50 dark:bg-emerald-500/10")}>
                  <Clock className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {usage.avg_duration.toFixed(0)}
                  <span className="text-lg text-muted-foreground ml-1">
                    sec
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Average check-in duration in seconds
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Conversations
                </CardTitle>
                <div className={cn("rounded-lg p-2", "bg-amber-50 dark:bg-amber-500/10")}>
                  <MessageCircle className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatNumber(usage.total_conversations)}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Total journal entries created
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}
