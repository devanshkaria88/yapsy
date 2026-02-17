"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Shield, ShieldCheck, Trash2, UserCog } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useApiQuery } from "@/hooks/use-api";
import { api } from "@/lib/api-client";
import { getStoredUser } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import { AdminUserDialog } from "./admin-user-dialog";
import type { AdminRole } from "@/lib/types";

interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}

export function AdminUserTable() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserRow | null>(null);
  const queryClient = useQueryClient();
  const currentUser = getStoredUser();

  const { data, isLoading } = useApiQuery<AdminUserRow[]>(
    ["admins"],
    "/admins",
    undefined,
    { staleTime: 30_000 }
  );

  const admins = data?.data ?? [];

  async function handleCreate(values: {
    email: string;
    name: string;
    role: string;
  }) {
    try {
      await api.post("/admins", values);
      toast.success(`${values.email} added as ${values.role}`);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create admin");
      throw err; // re-throw so form stays open on error
    }
  }

  async function handleRoleChange(admin: AdminUserRow, newRole: AdminRole) {
    try {
      await api.patch(`/admins/${admin.id}/role`, { role: newRole });
      toast.success(`${admin.email} is now ${newRole}`);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update role");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admins/${deleteTarget.id}`);
      toast.success(`${deleteTarget.email} has been removed`);
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove admin");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {admins.length} admin{admins.length !== 1 ? "s" : ""} total
        </p>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3">Admin</TableHead>
              <TableHead className="px-4 py-3">Role</TableHead>
              <TableHead className="px-4 py-3">Created</TableHead>
              <TableHead className="px-4 py-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Skeleton className="h-5 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : admins.length > 0 ? (
              admins.map((admin) => {
                const isSelf = admin.id === currentUser?.id;
                return (
                  <TableRow key={admin.id}>
                    <TableCell className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium">
                          {admin.name}
                          {isSelf && (
                            <span className="ml-2 text-xs text-muted-foreground">
                              (you)
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {admin.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {isSelf ? (
                        <Badge
                          variant={
                            admin.role === "super_admin"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {admin.role === "super_admin" ? (
                            <ShieldCheck className="mr-1 h-3 w-3" />
                          ) : (
                            <Shield className="mr-1 h-3 w-3" />
                          )}
                          {admin.role === "super_admin"
                            ? "Super Admin"
                            : "Moderator"}
                        </Badge>
                      ) : (
                        <Select
                          value={admin.role}
                          onValueChange={(v) =>
                            handleRoleChange(admin, v as AdminRole)
                          }
                        >
                          <SelectTrigger className="w-[150px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="moderator">
                              <div className="flex items-center gap-1.5">
                                <Shield className="h-3 w-3" />
                                Moderator
                              </div>
                            </SelectItem>
                            <SelectItem value="super_admin">
                              <div className="flex items-center gap-1.5">
                                <ShieldCheck className="h-3 w-3" />
                                Super Admin
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                      {formatDate(admin.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      {!isSelf && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                          onClick={() => setDeleteTarget(admin)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UserCog className="h-8 w-8" />
                    <p>No admin users found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <AdminUserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{deleteTarget?.email}</strong> as an admin? They will no
              longer be able to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
