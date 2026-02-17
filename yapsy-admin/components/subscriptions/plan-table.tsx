"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
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
import { useApiQuery } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { PlanDialog } from "./plan-dialog";
import type { Plan } from "@/lib/types";
import { useQueryClient } from "@tanstack/react-query";

export function PlanTable() {
  const { isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  const { data, isLoading } = useApiQuery<Plan[]>(
    ["subscriptions", "plans"],
    "/subscriptions/plans"
  );
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete() {
    if (!deletingId) return;
    try {
      await api.delete(`/subscriptions/plans/${deletingId}`);
      toast.success("Plan deleted");
      queryClient.invalidateQueries({ queryKey: ["subscriptions", "plans"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete plan");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Plans</h3>
        {isSuperAdmin && (
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Plan
          </Button>
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3">Name</TableHead>
              <TableHead className="px-4 py-3">Price</TableHead>
              <TableHead className="px-4 py-3">Interval</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="px-4 py-3">Created</TableHead>
              {isSuperAdmin && (
                <TableHead className="px-4 py-3 text-right">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: isSuperAdmin ? 6 : 5 }).map(
                    (_, ci) => (
                      <TableCell key={ci} className="px-4 py-3">
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    )
                  )}
                </TableRow>
              ))
            ) : data?.data?.length ? (
              data.data.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="px-4 py-3">
                    <p className="font-medium">{plan.name}</p>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    {plan.price_amount > 0
                      ? `₹${(plan.price_amount / 100).toFixed(0)}`
                      : "Free"}
                  </TableCell>
                  <TableCell className="px-4 py-3 capitalize">
                    {plan.interval}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge variant={plan.is_active ? "default" : "secondary"}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-muted-foreground">
                    {formatDate(plan.created_at)}
                  </TableCell>
                  {isSuperAdmin && (
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingPlan(plan)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletingId(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={isSuperAdmin ? 6 : 5}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Package className="h-8 w-8" />
                    <p>No plans configured</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create / Edit Dialog */}
      <PlanDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        plan={null}
      />
      <PlanDialog
        open={!!editingPlan}
        onOpenChange={(open) => !open && setEditingPlan(null)}
        plan={editingPlan}
      />

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
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
