"use client";

import { AdminUserTable } from "@/components/admin-users/admin-user-table";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Users</h2>
        <p className="text-sm text-muted-foreground">
          Manage who has access to the admin panel
        </p>
      </div>
      <AdminUserTable />
    </div>
  );
}
