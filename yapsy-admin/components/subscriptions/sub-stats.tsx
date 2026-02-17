"use client";

import {
  CreditCard,
  UserMinus,
  Users,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import type { SubscriptionStats } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

interface Props {
  data: SubscriptionStats | undefined;
  isLoading: boolean;
}

interface StatCard {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function SubStats({ data, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const totalUsers = data.total_pro + data.total_free + data.total_cancelled;
  const conversionRate =
    totalUsers > 0 ? ((data.total_pro / totalUsers) * 100).toFixed(1) : "0.0";

  const cards: StatCard[] = [
    {
      title: "Pro Subscribers",
      value: formatNumber(data.total_pro),
      description: "Active PRO users",
      icon: CreditCard,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      title: "Free Users",
      value: formatNumber(data.total_free),
      description: "Users on free plan",
      icon: Users,
      color: "text-sky-600",
      bgColor: "bg-sky-50 dark:bg-sky-500/10",
    },
    {
      title: "Cancelled",
      value: formatNumber(data.total_cancelled),
      description: "Cancelled subscriptions",
      icon: UserMinus,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-500/10",
    },
    {
      title: "MRR",
      value: `₹${data.mrr_inr}`,
      description: `${conversionRate}% conversion rate`,
      icon: IndianRupee,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
