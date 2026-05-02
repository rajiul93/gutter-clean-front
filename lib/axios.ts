import axios, { type AxiosError } from "axios";
import { apiBase } from "@/lib/api";

/** Standard envelope returned by the Express API. */
export type ApiEnvelope<T> = {
  status: number;
  message: string;
  data: T;
};

/** Singleton public axios instance — no auth header attached. */
export const publicAxios = axios.create({
  baseURL: apiBase(),
  timeout: 20_000,
});

/** Extracts the `data` field from a `{ status, message, data }` response. */
export function unwrap<T>(payload: ApiEnvelope<T>): T {
  return payload.data;
}

/** Best-effort error message extractor for axios errors with our envelope shape. */
export function apiErrorMessage(err: unknown, fallback = "Request failed"): string {
  const ax = err as AxiosError<{ message?: string }>;
  return ax?.response?.data?.message || ax?.message || fallback;
}
