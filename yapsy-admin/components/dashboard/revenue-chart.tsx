"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  ComposedChart,
} from "recharts";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import type { RevenueDataPoint } from "@/lib/types";

const chartConfig = {
  mrr: {
    label: "MRR",
    color: "var(--color-chart-1)",
  },
  churn: {
    label: "Churn",
    color: "var(--color-chart-5)",
  },
};

export function RevenueChart() {
  const { data, isLoading } = useApiQuery<RevenueDataPoint[]>(
    ["dashboard", "revenue"],
    "/dashboard/revenue"
  );

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
          <CardDescription>
            Monthly recurring revenue & churn
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[300px] w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ComposedChart data={data?.data || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="mrr"
                fill="var(--color-chart-1)"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="churn"
                stroke="var(--color-chart-5)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
