"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import type { Plan } from "@/lib/types";

const planSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price_amount: z.number().min(0, "Price must be 0 or more"),
  currency: z.string(),
  interval: z.enum(["monthly", "yearly"]),
  features: z.string(),
  is_active: z.boolean(),
});

type PlanValues = z.infer<typeof planSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: Plan | null;
}

function featuresToText(features: Record<string, unknown>): string {
  return Object.entries(features)
    .map(([key, val]) => `${key}: ${val}`)
    .join("\n");
}

function textToFeatures(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        result[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim();
      } else {
        result[line] = "true";
      }
    });
  return result;
}

export function PlanDialog({ open, onOpenChange, plan }: Props) {
  const queryClient = useQueryClient();
  const isEditing = !!plan;

  const form = useForm<PlanValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      price_amount: 0,
      currency: "INR",
      interval: "monthly",
      features: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        price_amount: plan.price_amount,
        currency: plan.currency,
        interval: plan.interval,
        features: featuresToText(plan.features),
        is_active: plan.is_active,
      });
    } else {
      form.reset({
        name: "",
        price_amount: 0,
        currency: "INR",
        interval: "monthly",
        features: "",
        is_active: true,
      });
    }
  }, [plan, form]);

  async function onSubmit(values: PlanValues) {
    const body = {
      name: values.name,
      price_amount: values.price_amount,
      currency: values.currency,
      interval: values.interval,
      features: textToFeatures(values.features),
      is_active: values.is_active,
    };

    try {
      if (isEditing) {
        await api.patch(`/subscriptions/plans/${plan.id}`, body);
        toast.success("Plan updated");
      } else {
        await api.post("/subscriptions/plans", body);
        toast.success("Plan created");
      }
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", "plans"],
      });
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save plan"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Plan" : "Create Plan"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Pro Monthly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (paise)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(Number(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value > 0
                        ? `₹${(field.value / 100).toFixed(2)}`
                        : "Free"}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interval</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features (key: value, one per line)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={
                        "unlimited_checkins: true\nai_insights: true\npriority_support: true"
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">Active</FormLabel>
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? "Save Changes" : "Create Plan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
