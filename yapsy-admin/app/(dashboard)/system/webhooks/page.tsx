"use client";

import { useState } from "react";
import {
  RefreshCw,
  Webhook,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedQuery } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import { formatDateTime } from "@/lib/format";
import type { WebhookEvent } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

function statusVariant(
  status: WebhookEvent["status"]
): "default" | "destructive" | "secondary" {
  switch (status) {
    case "success":
      return "default";
    case "failed":
      return "destructive";
    case "pending":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function WebhooksPage() {
  const { isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const limit = 50;

  const { data, isLoading } = usePaginatedQuery<WebhookEvent>(
    ["system", "webhooks"],
    "/system/webhooks",
    { limit }
  );

  async function handleRetry(id: string) {
    setRetryingId(id);
    try {
      await api.post(`/system/webhooks/${id}/retry`);
      toast.success("Webhook retry queued");
      queryClient.invalidateQueries({ queryKey: ["system", "webhooks"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Retry failed");
    } finally {
      setRetryingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Webhooks</h2>
        <p className="text-sm text-muted-foreground">
          Incoming webhook events and delivery status
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3">Type</TableHead>
              <TableHead className="px-4 py-3">Source</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3">Response</TableHead>
              <TableHead className="px-4 py-3">Attempts</TableHead>
              <TableHead className="px-4 py-3">Time</TableHead>
              {isSuperAdmin && (
                <TableHead className="px-4 py-3 text-right">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: isSuperAdmin ? 7 : 6 }).map(
                    (_, ci) => (
                      <TableCell key={ci} className="px-4 py-3">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))
            ) : data?.data?.length ? (
              data.data.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="px-4 py-3">
                    <code className="text-xs font-mono">{event.type}</code>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {event.source}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant={statusVariant(event.status)}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                    {event.response_code ?? "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm">
                    {event.attempts}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                    {formatDateTime(event.created_at)}
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell className="px-4 py-3 text-right">
                      {event.status === "failed" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(event.id)}
                          disabled={retryingId === event.id}
                        >
                          <RefreshCw
                            className={`mr-1 h-3 w-3 ${
                              retryingId === event.id ? "animate-spin" : ""
                            }`}
                          />
                          Retry
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin ? 7 : 6}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Webhook className="h-8 w-8" />
                    <p>No webhook events found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <p className="text-sm text-muted-foreground">
          {data.meta.total} total events
        </p>
      )}
    </div>
  );
}
