"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import { formatDate, formatDateTime } from "@/lib/format";
import type { PromoCode, Redemption } from "@/lib/types";

export default function PromoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: promoData, isLoading: promoLoading } = useApiQuery<PromoCode>(
    ["promo-codes", id],
    `/promo-codes/${id}`
  );
  const { data: redemptionsData, isLoading: redemptionsLoading } =
    useApiQuery<Redemption[]>(
      ["promo-codes", id, "redemptions"],
      `/promo-codes/${id}/redemptions`
    );

  const promo = promoData?.data;
  const redemptions = redemptionsData?.data;

  if (promoLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!promo) return <p className="text-muted-foreground">Promo not found.</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/promo-codes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold tracking-tight font-mono">
            {promo.code}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              navigator.clipboard.writeText(promo.code);
              toast.success("Copied!");
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Badge variant={promo.is_active ? "default" : "secondary"}>
            {promo.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium capitalize">
                {promo.type.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Value</p>
              <p className="font-medium">
                {promo.type === "percentage"
                  ? `${promo.value}%`
                  : `₹${(promo.value / 100).toFixed(0)}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Usage</p>
              <p className="font-medium">
                {promo.used_count}
                {promo.max_uses ? ` / ${promo.max_uses}` : ""}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valid From</p>
              <p className="font-medium">
                {formatDate(promo.valid_from)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valid Until</p>
              <p className="font-medium">
                {promo.valid_until ? formatDate(promo.valid_until) : "No end date"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Redemptions</CardTitle>
          <CardDescription>Users who redeemed this code</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-3">User</TableHead>
                  <TableHead className="px-4 py-3">Redeemed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {redemptionsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-5 w-48" />
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Skeleton className="h-5 w-32" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : redemptions?.length ? (
                  redemptions.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="px-4 py-3">
                        <Link
                          href={`/users/${r.user_id}`}
                          className="hover:underline"
                        >
                          <p className="font-medium">{r.user_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.user_email}
                          </p>
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-muted-foreground">
                        {formatDateTime(r.redeemed_at)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No redemptions yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
