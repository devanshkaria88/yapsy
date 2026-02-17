"use client";

import { useApiQuery } from "@/hooks/use-api";
import { SubStats } from "@/components/subscriptions/sub-stats";
import { PlanTable } from "@/components/subscriptions/plan-table";
import type { SubscriptionStats } from "@/lib/types";

export default function SubscriptionsPage() {
  const { data, isLoading } = useApiQuery<SubscriptionStats>(
    ["subscriptions", "stats"],
    "/subscriptions/stats"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
        <p className="text-sm text-muted-foreground">
          Manage subscription plans and monitor metrics
        </p>
      </div>
      <SubStats data={data?.data} isLoading={isLoading} />
      <PlanTable />
    </div>
  );
}
