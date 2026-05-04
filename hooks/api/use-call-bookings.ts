"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useAxiosSecure } from "@/hooks/use-axios-secure";
import type { ApiEnvelope } from "@/lib/axios";
import type { JobSize, ServiceId } from "@/lib/booking-pricing";
import type { SlotPeriod } from "@/lib/booking-slots";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

export type CallBookingPreferredSlot = "morning" | "afternoon" | "evening" | "flexible";

export type CallBookingRow = {
  _id: string;
  name: string;
  phone: string;
  serviceId: ServiceId;
  /** YYYY-MM-DD when the customer wants the visit (from the call). */
  preferredDateISO?: string;
  preferredSlot: CallBookingPreferredSlot;
  address: string;
  notes?: string;
  /** Latest `{Booking}` id from converting this intake (updates on repeat; all jobs listed under `/admin` online bookings). */
  linkedBookingId?: string;
  /** Optional contact email on the lead; if it matches an existing site user, the booking links to them. */
  customerEmail?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CallBookingsListPage = {
  items: CallBookingRow[];
  total: number;
  page: number;
  limit: number;
};

export type CallBookingsListParams = {
  page: number;
  limit: number;
};

export const callBookingsListKey = (params: CallBookingsListParams) =>
  ["call-bookings", params] as const;

export const callBookingDetailKey = (id: string) => ["call-booking", id] as const;

/** GET /api/v1/admin/call-bookings — admin only. */
export function useCallBookingsList(params: CallBookingsListParams) {
  const axios = useAxiosSecure();
  const { firebaseUser, profile, loading, profileLoading } = useAuth();
  const isAdmin = profile?.role === "ADMIN";
  return useQuery({
    queryKey: callBookingsListKey(params),
    enabled: !loading && !profileLoading && !!firebaseUser && isAdmin,
    queryFn: async () => {
      const { data } = await axios.get<ApiEnvelope<CallBookingsListPage>>(
        "/api/v1/admin/call-bookings",
        { params },
      );
      return data.data;
    },
    placeholderData: keepPreviousData,
  });
}

/** GET /api/v1/admin/call-bookings/:id — admin only. */
export function useCallBooking(id: string | undefined) {
  const axios = useAxiosSecure();
  const { firebaseUser, profile, loading, profileLoading } = useAuth();
  const isAdmin = profile?.role === "ADMIN";
  return useQuery({
    queryKey: callBookingDetailKey(id ?? ""),
    enabled: !!id && !loading && !profileLoading && !!firebaseUser && isAdmin,
    queryFn: async () => {
      const { data } = await axios.get<ApiEnvelope<CallBookingRow>>(
        `/api/v1/admin/call-bookings/${id}`,
      );
      return data.data;
    },
  });
}

export type CreateCallBookingBody = {
  name: string;
  phone: string;
  serviceId: ServiceId;
  preferredDateISO: string;
  preferredSlot: CallBookingPreferredSlot;
  address: string;
  notes?: string;
  customerEmail?: string;
};

export type PatchCallBookingBody = Partial<{
  name: string;
  phone: string;
  serviceId: ServiceId;
  preferredDateISO: string;
  preferredSlot: CallBookingPreferredSlot;
  address: string;
  notes: string | null;
  customerEmail: string | null;
}>;

/** POST /api/v1/admin/call-bookings — returns conflict payload as rejected error data when 409. */
export function useCreateCallBooking() {
  const axios = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateCallBookingBody) => {
      try {
        const { data } = await axios.post<ApiEnvelope<CallBookingRow>>(
          "/api/v1/admin/call-bookings",
          body,
        );
        return { outcome: "created" as const, row: data.data };
      } catch (err) {
        const ax = err as AxiosError<ApiEnvelope<{ existingId: string } | null>>;
        if (ax.response?.status === 409) {
          const existingId = ax.response.data?.data?.existingId;
          if (existingId) {
            return { outcome: "conflict" as const, existingId };
          }
        }
        throw err;
      }
    },
    onSuccess: (res) => {
      if (res.outcome === "created") {
        qc.invalidateQueries({ queryKey: ["call-bookings"] });
      }
    },
  });
}

/** PATCH /api/v1/admin/call-bookings/:id */
export function usePatchCallBooking() {
  const axios = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: PatchCallBookingBody }) => {
      const { data } = await axios.patch<ApiEnvelope<CallBookingRow>>(
        `/api/v1/admin/call-bookings/${id}`,
        body,
      );
      return data.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["call-bookings"] });
      qc.invalidateQueries({ queryKey: callBookingDetailKey(vars.id) });
    },
  });
}

export type CreatedSiteBookingResult = {
  lead: CallBookingRow;
  booking: {
    _id: string;
    dateISO: string;
    slot: string;
    serviceId: string;
    total: number;
    status: string;
    /** Set when linked to a site User; null for pure phone bookings (still listed under admin online bookings). */
    userId: string | null;
  };
};

export type CreateSiteBookingFromLeadInput = {
  customerUserId?: string;
  /** If provided and matches a site User, booking links there; otherwise stored on `Booking.email` without an account. */
  email?: string;
  dateISO?: string;
  slot: SlotPeriod;
  serviceId?: ServiceId;
  featureIds: string[];
  size: JobSize;
  name?: string;
  phone?: string;
  location?: string;
};

/** POST `/api/v1/admin/call-bookings/:leadId/site-booking` — create a dashboard `Booking` from phone intake (same listing as `/book`). */
export function useCreateSiteBookingFromLead() {
  const axios = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ leadId, body }: { leadId: string; body: CreateSiteBookingFromLeadInput }) => {
      const { data } = await axios.post<ApiEnvelope<CreatedSiteBookingResult>>(
        `/api/v1/admin/call-bookings/${leadId}/site-booking`,
        body,
      );
      return data.data;
    },
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["call-bookings"] });
      qc.invalidateQueries({ queryKey: callBookingDetailKey(vars.leadId) });
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
}

/** GET /api/v1/admin/call-bookings/lookup?phone=… */
export function useLookupCallBookingByPhone() {
  const axios = useAxiosSecure();
  return useMutation({
    mutationFn: async (phone: string) => {
      const { data } = await axios.get<ApiEnvelope<CallBookingRow | null>>(
        "/api/v1/admin/call-bookings/lookup",
        { params: { phone } },
      );
      return data.data;
    },
  });
}
