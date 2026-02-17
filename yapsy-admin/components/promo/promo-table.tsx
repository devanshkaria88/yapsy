"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Tag, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePaginatedQuery } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { PromoDialog } from "./promo-dialog";
import type { PromoCode } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export function PromoTable() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const limit = 20;

  const { data, isLoading } = usePaginatedQuery<PromoCode>(
    ["promo-codes"],
    "/promo-codes",
    {
      page,
      limit,
    }
  );

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  }

  async function handleDelete() {
    if (!deletingId) return;
    try {
      await api.delete(`/promo-codes/${deletingId}`);
      toast.success("Promo code deleted");
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Create Code
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3">Code</TableHead>
              <TableHead className="px-4 py-3">Type</TableHead>
              <TableHead className="px-4 py-3">Value</TableHead>
              <TableHead className="px-4 py-3">Usage</TableHead>
              <TableHead className="px-4 py-3">Expires</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, ci) => (
                    <TableCell key={ci} className="px-4 py-3">
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.data?.length ? (
              data.data.map((promo) => (
                <TableRow
                  key={promo.id}
                  className="cursor-pointer"
                  onClick={() => router.push(`/promo-codes/${promo.id}`)}
                >
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">
                        {promo.code}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyCode(promo.code);
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 capitalize">
                    {promo.type.replace("_", " ")}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {promo.type === "percentage"
                      ? `${promo.value}%`
                      : `₹${(promo.value / 100).toFixed(0)}`}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {promo.used_count}
                    {promo.max_uses ? ` / ${promo.max_uses}` : ""}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {promo.valid_until
                      ? formatDate(promo.valid_until)
                      : "Never"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant={promo.is_active ? "default" : "secondary"}
                    >
                      {promo.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-right">
                    <div
                      className="flex justify-end gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingPromo(promo)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingId(promo.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Tag className="h-8 w-8" />
                    <p>No promo codes found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data?.meta && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.meta.total} total codes
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.meta.hasMore}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <PromoDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        promo={null}
      />
      <PromoDialog
        open={!!editingPromo}
        onOpenChange={(open) => !open && setEditingPromo(null)}
        promo={editingPromo}
      />

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promo Code</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the promo code. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
