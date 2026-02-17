"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import { UserProfileCard } from "@/components/users/user-profile-card";
import { UserSubscriptionCard } from "@/components/users/user-subscription-card";
import { UserStatsCard } from "@/components/users/user-stats-card";
import { UserJournals } from "@/components/users/user-journals";
import { UserTasks } from "@/components/users/user-tasks";
import type { UserDetail } from "@/lib/types";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useApiQuery<UserDetail>(
    ["users", id],
    `/users/${id}`
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const user = data?.data;
  if (!user) return <p className="text-muted-foreground">User not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <UserProfileCard user={user} />
        <UserSubscriptionCard user={user} />
        <UserStatsCard user={user} />
      </div>

      <Tabs defaultValue="journals">
        <TabsList>
          <TabsTrigger value="journals">Journals</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        <TabsContent value="journals" className="mt-4">
          <UserJournals userId={id} />
        </TabsContent>
        <TabsContent value="tasks" className="mt-4">
          <UserTasks userId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
