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
import { api } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import type { PromoCode } from "@/lib/types";

const promoSchema = z.object({
  code: z.string().min(1, "Code is required"),
  type: z.enum(["percentage", "flat", "set_price"]),
  value: z.number().min(1, "Value must be at least 1"),
  duration_months: z.number().optional(),
  max_uses: z.number().optional(),
  valid_from: z.string().min(1, "Valid from date is required"),
  valid_until: z.string().optional(),
  is_active: z.boolean(),
});

type PromoValues = z.infer<typeof promoSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo: PromoCode | null;
}

export function PromoDialog({ open, onOpenChange, promo }: Props) {
  const queryClient = useQueryClient();
  const isEditing = !!promo;

  const form = useForm<PromoValues>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      code: "",
      type: "percentage",
      value: 10,
      duration_months: undefined,
      max_uses: 100,
      valid_from: new Date().toISOString().split("T")[0],
      valid_until: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (promo) {
      form.reset({
        code: promo.code,
        type: promo.type,
        value: promo.value,
        duration_months: promo.duration_months ?? undefined,
        max_uses: promo.max_uses ?? undefined,
        valid_from: promo.valid_from?.split("T")[0] || "",
        valid_until: promo.valid_until?.split("T")[0] || "",
        is_active: promo.is_active,
      });
    } else {
      form.reset({
        code: "",
        type: "percentage",
        value: 10,
        duration_months: undefined,
        max_uses: 100,
        valid_from: new Date().toISOString().split("T")[0],
        valid_until: "",
        is_active: true,
      });
    }
  }, [promo, form]);

  async function onSubmit(values: PromoValues) {
    const body = {
      ...values,
      code: values.code.toUpperCase(),
      valid_from: new Date(values.valid_from).toISOString(),
      valid_until: values.valid_until
        ? new Date(values.valid_until).toISOString()
        : undefined,
      duration_months: values.duration_months || undefined,
      max_uses: values.max_uses || undefined,
    };

    try {
      if (isEditing) {
        await api.patch(`/promo-codes/${promo.id}`, body);
        toast.success("Promo code updated");
      } else {
        await api.post("/promo-codes", body);
        toast.success("Promo code created");
      }
      queryClient.invalidateQueries({ queryKey: ["promo-codes"] });
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save promo"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Promo Code" : "Create Promo Code"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SAVE20"
                      className="font-mono uppercase"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
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
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="flat">Flat Amount</SelectItem>
                        <SelectItem value="set_price">Set Price</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration_months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Optional"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_uses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Uses</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Optional"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valid_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid From</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="valid_until"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid Until (optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                {isEditing ? "Save Changes" : "Create Code"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
