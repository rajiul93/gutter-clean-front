"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useAxiosSecure } from "@/hooks/use-axios-secure";
import type { ApiEnvelope } from "@/lib/axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type AdminPopulatedUser = {
  _id: string;
  email?: string;
  displayName?: string;
};

export type AdminBookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export type AdminBookingRow = {
  _id: string;
  dateISO: string;
  slot: string;
  serviceId: string;
  featureIds?: string[];
  size?: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  total: number;
  status: AdminBookingStatus | string;
  userId?: AdminPopulatedUser | string;
  createdAt?: string;
};

export type AdminBookingsPage = {
  items: AdminBookingRow[];
  total: number;
  page: number;
  limit: number;
};

export type AdminBookingsParams = {
  page: number;
  limit: number;
  dateFrom?: string;
  dateTo?: string;
};

export const adminBookingsKey = (params: AdminBookingsParams) =>
  ["admin-bookings", params] as const;

/** GET /api/v1/admin/bookings — admin only, with pagination + date filter. */
export function useAdminBookings(params: AdminBookingsParams) {
  const axios = useAxiosSecure();
  const { firebaseUser, profile, loading, profileLoading } = useAuth();
  const isAdmin = profile?.role === "ADMIN";
  return useQuery({
    queryKey: adminBookingsKey(params),
    enabled: !loading && !profileLoading && !!firebaseUser && isAdmin,
    queryFn: async () => {
      const { data } = await axios.get<ApiEnvelope<AdminBookingsPage>>(
        "/api/v1/admin/bookings",
        { params },
      );
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export type PatchAdminBookingStatusInput = {
  id: string;
  status: Exclude<AdminBookingStatus, "pending">;
};

/** PATCH /api/v1/admin/bookings/:id/status — admin only. */
export function useUpdateAdminBookingStatus() {
  const axios = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: PatchAdminBookingStatusInput) => {
      const { data } = await axios.patch<ApiEnvelope<AdminBookingRow>>(
        `/api/v1/admin/bookings/${id}/status`,
        { status },
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
}
