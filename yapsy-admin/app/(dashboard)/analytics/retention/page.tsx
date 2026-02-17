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
import type { CohortRow } from "@/lib/types";

function getRetentionColor(value: number): string {
  if (value >= 80) return "bg-emerald-500 text-white";
  if (value >= 60) return "bg-emerald-400 text-white";
  if (value >= 40) return "bg-amber-400 text-white";
  if (value >= 20) return "bg-orange-400 text-white";
  if (value > 0) return "bg-red-400 text-white";
  return "bg-muted text-muted-foreground";
}

export default function RetentionPage() {
  const { data, isLoading } = useApiQuery<CohortRow[]>(
    ["analytics", "retention"],
    "/analytics/retention",
    undefined,
    { staleTime: 60_000 }
  );

  const cohorts = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Retention Cohorts
        </h2>
        <p className="text-sm text-muted-foreground">
          Monthly retention by signup cohort
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Monthly Cohorts
          </CardTitle>
          <CardDescription>
            Each row is a signup cohort showing how many users were retained
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : cohorts?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left font-medium text-muted-foreground">
                      Cohort
                    </th>
                    <th className="p-2 text-center font-medium text-muted-foreground">
                      Total Users
                    </th>
                    <th className="p-2 text-center font-medium text-muted-foreground">
                      Retained
                    </th>
                    <th className="p-2 text-center font-medium text-muted-foreground">
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cohorts.map((cohort) => (
                    <tr key={cohort.cohort_month} className="border-t">
                      <td className="p-2 font-medium whitespace-nowrap">
                        {cohort.cohort_month}
                      </td>
                      <td className="p-2 text-center text-muted-foreground">
                        {cohort.total_users}
                      </td>
                      <td className="p-2 text-center text-muted-foreground">
                        {cohort.retained_users}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center justify-center">
                          <div
                            className={cn(
                              "flex h-9 w-16 items-center justify-center rounded text-xs font-medium",
                              getRetentionColor(cohort.rate)
                            )}
                          >
                            {cohort.rate.toFixed(1)}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No retention data available
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
