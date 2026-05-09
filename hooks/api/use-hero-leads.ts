"use client";

import { useAuth } from "@/components/providers/auth-provider";
import type { ApiEnvelope } from "@/lib/axios";
import { useAxiosSecure } from "@/hooks/use-axios-secure";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type HeroLeadRow = {
  _id: string;
  name: string;
  phone: string;
  location: string;
  callback: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type HeroLeadsPage = {
  items: HeroLeadRow[];
  total: number;
  page: number;
  limit: number;
};

export type HeroLeadsParams = { page: number; limit: number };

export const heroLeadsAdminKey = (params: HeroLeadsParams) =>
  ["admin-hero-leads", params] as const;

export function useAdminHeroLeads(params: HeroLeadsParams) {
  const axios = useAxiosSecure();
  const { firebaseUser, profile, loading, profileLoading } = useAuth();
  const isAdmin = profile?.role === "ADMIN";

  return useQuery({
    queryKey: heroLeadsAdminKey(params),
    enabled: !loading && !profileLoading && !!firebaseUser && isAdmin,
    queryFn: async () => {
      const { data } = await axios.get<ApiEnvelope<HeroLeadsPage>>("/api/v1/admin/hero-leads", {
        params,
      });
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function usePatchHeroLeadCallback() {
  const axios = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, callback }: { id: string; callback: boolean }) => {
      const { data } = await axios.patch<ApiEnvelope<HeroLeadRow>>(
        `/api/v1/admin/hero-leads/${id}/callback`,
        { callback },
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-hero-leads"] });
    },
  });
}
