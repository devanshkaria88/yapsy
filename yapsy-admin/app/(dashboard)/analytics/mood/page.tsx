"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
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
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import { formatNumber } from "@/lib/format";
import type { MoodDistribution, ThemeData } from "@/lib/types";

const moodBuckets = [
  { key: "low", label: "Low (1-3)", color: "#ef4444" },
  { key: "medium", label: "Medium (4-6)", color: "#f59e0b" },
  { key: "high", label: "High (7-10)", color: "#22c55e" },
] as const;

export default function MoodThemesPage() {
  const { data: moodData, isLoading: moodLoading } =
    useApiQuery<MoodDistribution>(
      ["analytics", "mood-distribution"],
      "/analytics/mood-distribution",
      undefined,
      { staleTime: 60_000 }
    );

  const { data: themeData, isLoading: themeLoading } = useApiQuery<
    ThemeData[]
  >(
    ["analytics", "themes"],
    "/analytics/themes",
    undefined,
    { staleTime: 60_000 }
  );

  const mood = moodData?.data;
  const moodChartData = mood
    ? moodBuckets.map((b) => ({
        label: b.label,
        count: mood[b.key],
        color: b.color,
      }))
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mood & Themes</h2>
        <p className="text-sm text-muted-foreground">
          Distribution of mood scores and common journal themes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Mood Distribution
            </CardTitle>
            <CardDescription>
              Mood score buckets across all check-ins
              {mood ? ` (${formatNumber(mood.total)} total)` : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moodLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : moodChartData.length ? (
              <ChartContainer
                config={{
                  count: { label: "Count", color: "var(--color-chart-1)" },
                }}
                className="h-[300px] w-full"
              >
                <BarChart data={moodChartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="label" className="text-xs" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {moodChartData.map((entry) => (
                      <Cell key={entry.label} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No mood data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Themes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Journal Themes
            </CardTitle>
            <CardDescription>
              Most common themes across journal entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {themeLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (themeData?.data?.length ?? 0) > 0 ? (
              <ChartContainer
                config={{
                  count: { label: "Count", color: "var(--color-chart-2)" },
                }}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={themeData?.data || []}
                  layout="vertical"
                  margin={{ left: 80 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis type="number" className="text-xs" />
                  <YAxis
                    dataKey="theme"
                    type="category"
                    className="text-xs"
                    width={70}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--color-chart-2)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No theme data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
