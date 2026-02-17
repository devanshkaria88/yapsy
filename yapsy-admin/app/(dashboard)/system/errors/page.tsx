"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { usePaginatedQuery } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ErrorLog } from "@/lib/types";

function levelVariant(level: ErrorLog["level"]): "default" | "destructive" | "secondary" {
  switch (level) {
    case "fatal":
      return "destructive";
    case "error":
      return "destructive";
    case "warn":
      return "secondary";
    default:
      return "default";
  }
}

export default function ErrorLogPage() {
  const limit = 50;

  const { data, isLoading } = usePaginatedQuery<ErrorLog>(
    ["system", "errors"],
    "/system/errors",
    { limit }
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Error Log</h2>
        <p className="text-sm text-muted-foreground">
          Recent application errors and warnings
        </p>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8 px-4 py-3" />
              <TableHead className="px-4 py-3">Level</TableHead>
              <TableHead className="px-4 py-3">Message</TableHead>
              <TableHead className="px-4 py-3">Endpoint</TableHead>
              <TableHead className="px-4 py-3">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, ci) => (
                    <TableCell key={ci} className="px-4 py-3">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data?.length ? (
              data.data.map((error) => (
                <ErrorRow key={error.id} error={error} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-8 w-8" />
                    <p>No errors found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <p className="text-sm text-muted-foreground">
          {data.meta.total} total errors
        </p>
      )}
    </div>
  );
}

function ErrorRow({ error }: { error: ErrorLog }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        className={cn(error.stack && "cursor-pointer")}
        onClick={() => error.stack && setOpen(!open)}
      >
        <TableCell className="px-4 py-3">
          {error.stack && (
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                open && "rotate-180"
              )}
            />
          )}
        </TableCell>
        <TableCell className="px-4 py-3">
          <Badge variant={levelVariant(error.level)}>
            {error.level}
          </Badge>
        </TableCell>
        <TableCell className="px-4 py-3">
          <p className="max-w-xs truncate text-sm">{error.message}</p>
        </TableCell>
        <TableCell className="px-4 py-3">
          <code className="text-xs font-mono text-muted-foreground">
            {error.endpoint}
          </code>
        </TableCell>
        <TableCell className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
          {formatDateTime(error.created_at)}
        </TableCell>
      </TableRow>
      {open && error.stack && (
        <TableRow>
          <TableCell colSpan={5} className="bg-muted/50 px-4 py-3">
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap font-mono text-xs text-muted-foreground">
              {error.stack}
            </pre>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
