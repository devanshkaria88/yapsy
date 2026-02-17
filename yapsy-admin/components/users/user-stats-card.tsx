"use client";

import { Flame, BookOpen, CheckSquare, Smile } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { moodColor } from "@/lib/format";
import type { UserDetail } from "@/lib/types";

interface Props {
  user: UserDetail;
}

export function UserStatsCard({ user }: Props) {
  const stats = [
    {
      label: "Current Streak",
      value: `${user.streak_current} days`,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      label: "Longest Streak",
      value: `${user.streak_longest} days`,
      icon: Flame,
      color: "text-amber-500",
    },
    {
      label: "Total Journals",
      value: user.total_journals,
      icon: BookOpen,
      color: "text-primary",
    },
    {
      label: "Total Tasks",
      value: user.total_tasks,
      icon: CheckSquare,
      color: "text-emerald-500",
    },
    {
      label: "Avg Mood",
      value: user.avg_mood != null ? user.avg_mood.toFixed(1) : "—",
      icon: Smile,
      color: user.avg_mood != null ? moodColor(user.avg_mood) : "text-muted-foreground",
    },
    {
      label: "Check-ins",
      value: user.check_in_count,
      icon: BookOpen,
      color: "text-sky-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="flex items-center gap-1.5">
                <stat.icon className={cn("h-3.5 w-3.5", stat.color)} />
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
