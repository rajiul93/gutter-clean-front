"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useAxiosSecure } from "@/hooks/use-axios-secure";
import type { ApiEnvelope } from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Address = {
  name: string;
  email: string;
  phone: string;
  location: string;
};

export type AddressInput = Address;

export const myAddressKey = ["my-address"] as const;

/** GET /api/v1/me/address — saved address of the current user. */
export function useMyAddress() {
  const axios = useAxiosSecure();
  const { firebaseUser, loading } = useAuth();
  return useQuery({
    queryKey: myAddressKey,
    enabled: !loading && !!firebaseUser,
    queryFn: async () => {
      const { data } = await axios.get<ApiEnvelope<Address | null>>("/api/v1/me/address");
      return data.data;
    },
  });
}

/** PUT /api/v1/me/address — upsert the saved address. */
export function useUpsertAddress() {
  const axios = useAxiosSecure();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddressInput) => {
      const { data } = await axios.put<ApiEnvelope<Address>>("/api/v1/me/address", payload);
      return data.data;
    },
    onSuccess: (saved) => {
      qc.setQueryData(myAddressKey, saved);
    },
  });
}
