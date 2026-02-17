"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { ApiMeta } from "@/lib/types";

export function useApiQuery<T>(
  key: string[],
  endpoint: string,
  params?: Record<string, string | number | undefined>,
  options?: { staleTime?: number; enabled?: boolean }
) {
  return useQuery({
    queryKey: [...key, params],
    queryFn: async () => {
      const res = await api.get<T>(endpoint, params);
      return { data: res.data, meta: res.meta };
    },
    staleTime: options?.staleTime ?? 30_000,
    enabled: options?.enabled,
  });
}

export function useApiMutation<TData, TBody = unknown>(
  endpoint: string,
  method: "post" | "patch" | "delete" = "post",
  invalidateKeys?: string[][]
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: TBody) => {
      const res = await api[method]<TData>(endpoint, body);
      return res.data;
    },
    onSuccess: () => {
      invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    },
  });
}

export function usePaginatedQuery<T>(
  key: string[],
  endpoint: string,
  params: Record<string, string | number | undefined>
) {
  return useQuery({
    queryKey: [...key, params],
    queryFn: async () => {
      const res = await api.get<T[]>(endpoint, params);
      return {
        data: res.data,
        meta: res.meta as ApiMeta,
      };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
