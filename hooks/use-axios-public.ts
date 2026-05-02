"use client";

import { publicAxios } from "@/lib/axios";

/**
 * Public axios instance — used for endpoints that do not require authentication
 * (e.g. availability, public listings).
 */
export function useAxiosPublic() {
  return publicAxios;
}
