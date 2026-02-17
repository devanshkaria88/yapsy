"use client";

import { UserTable } from "@/components/users/user-table";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-sm text-muted-foreground">
          Manage and view all Yapsy users
        </p>
      </div>
      <UserTable />
    </div>
  );
}
