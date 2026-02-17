"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import type { GrowthDataPoint } from "@/lib/types";
import { format, parseISO } from "date-fns";

const chartConfig = {
  count: {
    label: "Check-ins",
    color: "var(--color-chart-2)",
  },
};

export function CheckInChart() {
  const { data, isLoading } = useApiQuery<GrowthDataPoint[]>(
    ["dashboard", "check-ins"],
    "/dashboard/check-ins",
    { days: 14 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Daily Check-ins
        </CardTitle>
        <CardDescription>
          Check-in volume over the last 14 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={data?.data || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => {
                  try {
                    return format(parseISO(v), "MMM d");
                  } catch {
                    return v;
                  }
                }}
                className="text-xs"
              />
              <YAxis className="text-xs" />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(v) => {
                      try {
                        return format(parseISO(v as string), "MMM d, yyyy");
                      } catch {
                        return String(v);
                      }
                    }}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
