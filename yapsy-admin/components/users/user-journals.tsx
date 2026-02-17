"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { useApiQuery } from "@/hooks/use-api";
import { formatDate, moodColor } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Journal } from "@/lib/types";

interface Props {
  userId: string;
}

export function UserJournals({ userId }: Props) {
  const { data, isLoading } = useApiQuery<Journal[]>(
    ["users", userId, "journals"],
    `/users/${userId}/journals`
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  const journals = data?.data;

  if (!journals?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <BookOpen className="h-8 w-8 mb-2" />
        <p>No journals yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {journals.map((journal) => (
        <Card key={journal.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">
                    {formatDate(journal.date)}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      moodColor(journal.mood_score)
                    )}
                  >
                    Mood: {journal.mood_score}/10
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {journal.summary}
                </p>
                {journal.themes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {journal.themes.map((theme) => (
                      <Badge key={theme} variant="secondary" className="text-xs">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
