"use client";

import { PromoTable } from "@/components/promo/promo-table";

export default function PromoCodesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Promo Codes</h2>
        <p className="text-sm text-muted-foreground">
          Create and manage promotional codes
        </p>
      </div>
      <PromoTable />
    </div>
  );
}
