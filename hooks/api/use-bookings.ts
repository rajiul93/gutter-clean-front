"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useAxiosSecure } from "@/hooks/use-axios-secure";
import type { ApiEnvelope } from "@/lib/axios";
import type { SubmitBookingInput } from "@/lib/booking-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type BookingRow = {
  _id: string;
  dateISO: string;
  slot: string;
  serviceId: string;
  featureIds?: string[];
  size?: string;
  name?: string;
  email?: string;
  phone?: string;
  location: string;
  total: number;
  status: string;
  createdAt?: string;
};

export type BookingsPage = {
  items: BookingRow[];
  total: number;
  page: number;
  limit: number;
};

export const myBookingsKey = (page = 1, limit = 50) =>
  ["my-bookings", { page, limit }] as const;

/** GET /api/v1/bookings — current user's bookings. */
export function useMyBookings(opts: { page?: number; limit?: number } = {}) {
  const axios = useAxiosSecure();
  const { firebaseUser, loading } = useAuth();
  const { page = 1, limit = 50 } = opts;
  return useQuery({
    queryKey: myBookingsKey(page, limit),
    enabled: !loading && !!firebaseUser,
    queryFn: async () => {
      const { data } = await axios.get<ApiEnvelope<BookingsPage>>("/api/v1/bookings", {
        params: { page, limit },
      });
      return data.data;
    },
  });
}

/** POST /api/v1/bookings — create a booking for the signed-in user. */
export function useCreateBooking() {
  const axios = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SubmitBookingInput) => {
      const { data } = await axios.post<ApiEnvelope<BookingRow>>("/api/v1/bookings", input);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-bookings"] });
      qc.invalidateQueries({ queryKey: ["availability"] });
      qc.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
  });
}
