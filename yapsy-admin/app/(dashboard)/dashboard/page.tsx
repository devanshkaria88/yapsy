"use client";

import { useApiQuery } from "@/hooks/use-api";
import { KpiCards } from "@/components/dashboard/kpi-cards";
import { GrowthChart } from "@/components/dashboard/growth-chart";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CheckInChart } from "@/components/dashboard/checkin-chart";
import { RecentSignups } from "@/components/dashboard/recent-signups";
import type { DashboardOverview } from "@/lib/types";

export default function DashboardPage() {
  const { data, isLoading } = useApiQuery<DashboardOverview>(
    ["dashboard", "overview"],
    "/dashboard/overview",
    undefined,
    { staleTime: 30_000 }
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Welcome back. Here&apos;s what&apos;s happening with Yapsy today.
        </p>
      </div>

      <KpiCards data={data?.data} isLoading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-2">
        <GrowthChart />
        <RevenueChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CheckInChart />
        <RecentSignups />
      </div>
    </div>
  );
}
