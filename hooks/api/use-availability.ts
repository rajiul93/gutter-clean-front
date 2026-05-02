"use client";

import { useAxiosPublic } from "@/hooks/use-axios-public";
import type { ApiEnvelope } from "@/lib/axios";
import type { SlotPeriod } from "@/lib/booking-slots";
import { useQuery } from "@tanstack/react-query";

export type Availability = Record<SlotPeriod, number>;

export const availabilityKey = (dateISO: string | null) =>
  ["availability", dateISO] as const;

/** GET /api/v1/availability/:dateISO — public endpoint. */
export function useAvailability(dateISO: string | null) {
  const axios = useAxiosPublic();
  return useQuery({
    queryKey: availabilityKey(dateISO),
    enabled: !!dateISO,
    queryFn: async () => {
      const { data } = await axios.get<ApiEnvelope<Availability>>(
        `/api/v1/availability/${dateISO}`,
      );
      return data.data;
    },
    staleTime: 30_000,
  });
}
