"use client";

import { Mic, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery } from "@/hooks/use-api";
import { formatCurrency } from "@/lib/format";
import type { CostBreakdown } from "@/lib/types";
import type { LucideIcon } from "lucide-react";

interface CostCardProps {
  name: string;
  description: string;
  icon: LucideIcon;
  requests: number;
  cost: number;
}

function CostCard({ name, description, icon: Icon, requests, cost }: CostCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-muted p-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold">{requests.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Requests</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {formatCurrency(cost, "USD")}
            </p>
            <p className="text-xs text-muted-foreground">Cost</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CostsPage() {
  const { data, isLoading } = useApiQuery<CostBreakdown>(
    ["system", "costs"],
    "/system/costs",
    undefined,
    { staleTime: 60_000 }
  );

  const costs = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">API Costs</h2>
        <p className="text-sm text-muted-foreground">
          Third-party API cost breakdown (placeholder — wire up real tracking)
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {isLoading ? (
          <>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-32" />
              </CardContent>
            </Card>
          </>
        ) : costs ? (
          <>
            <CostCard
              name="ElevenLabs"
              description="Voice synthesis API"
              icon={Mic}
              requests={costs.elevenlabs.requests}
              cost={costs.elevenlabs.cost}
            />
            <CostCard
              name="Gemini"
              description="AI inference API"
              icon={Sparkles}
              requests={costs.gemini.requests}
              cost={costs.gemini.cost}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
