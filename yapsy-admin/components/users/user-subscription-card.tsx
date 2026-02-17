"use client";

import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subscriptionBadgeVariant } from "@/lib/badge-helpers";
import { formatDate } from "@/lib/format";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api-client";
import type { UserDetail, SubscriptionStatus } from "@/lib/types";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  user: UserDetail;
}

export function UserSubscriptionCard({ user }: Props) {
  const { isSuperAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState<SubscriptionStatus | "">(
    ""
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const sub = user.subscription;

  async function handleOverride() {
    if (!newStatus) return;
    setIsUpdating(true);
    try {
      await api.patch(`/users/${user.id}/subscription`, {
        subscription_status: newStatus,
      });
      toast.success("Subscription updated");
      queryClient.invalidateQueries({ queryKey: ["users", user.id] });
      setNewStatus("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update subscription"
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={subscriptionBadgeVariant(user.subscription_status)}>
            {user.subscription_status}
          </Badge>
          {sub && (
            <span className="text-sm text-muted-foreground">
              {sub.plan_name}
            </span>
          )}
        </div>

        {sub && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Started</p>
              <p className="font-medium">{formatDate(sub.started_at)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Expires</p>
              <p className="font-medium">
                {sub.expires_at ? formatDate(sub.expires_at) : "—"}
              </p>
            </div>
            {sub.razorpay_subscription_id && (
              <div className="col-span-2">
                <p className="text-muted-foreground">Razorpay ID</p>
                <p className="font-mono text-xs">
                  {sub.razorpay_subscription_id}
                </p>
              </div>
            )}
          </div>
        )}

        {isSuperAdmin && (
          <div className="space-y-2 rounded-lg border p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Override Status (Super Admin)
            </p>
            <div className="flex gap-2">
              <Select
                value={newStatus}
                onValueChange={(v) => setNewStatus(v as SubscriptionStatus)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleOverride}
                disabled={!newStatus || isUpdating}
              >
                Update
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
