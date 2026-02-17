"use client";

import { Users, CreditCard, IndianRupee, MessageCircle, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { DashboardOverview } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

interface KpiCardsProps {
  data: DashboardOverview | undefined;
  isLoading: boolean;
}

interface KpiCard {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function KpiCards({ data, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const cards: KpiCard[] = [
    {
      title: "Total Users",
      value: formatNumber(data.total_users),
      description: "All registered users",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Pro",
      value: formatNumber(data.active_pro),
      description: "Users with PRO subscription",
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(data.mrr / 100),
      description: "Monthly recurring revenue",
      icon: IndianRupee,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
    {
      title: "Total Check-ins",
      value: formatNumber(data.total_check_ins),
      description: "All-time check-ins",
      icon: MessageCircle,
      color: "text-sky-600",
      bgColor: "bg-sky-50 dark:bg-sky-500/10",
    },
    {
      title: "Active Today",
      value: formatNumber(data.active_today),
      description: "Users who checked in today",
      icon: Activity,
      color: "text-violet-600",
      bgColor: "bg-violet-50 dark:bg-violet-500/10",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn("rounded-lg p-2", card.bgColor)}>
              <card.icon className={cn("h-4 w-4", card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
