"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, Square, ListTodo } from "lucide-react";
import { useApiQuery } from "@/hooks/use-api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface Props {
  userId: string;
}

export function UserTasks({ userId }: Props) {
  const { data, isLoading } = useApiQuery<Task[]>(
    ["users", userId, "tasks"],
    `/users/${userId}/tasks`
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  const tasks = data?.data;

  if (!tasks?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ListTodo className="h-8 w-8 mb-2" />
        <p>No tasks yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="flex items-center gap-3 p-4">
            {task.completed ? (
              <CheckSquare className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <Square className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </p>
            </div>
            {task.due_date && (
              <span className="text-xs text-muted-foreground shrink-0">
                Due {formatDate(task.due_date)}
              </span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
