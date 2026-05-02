"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { apiBase } from "@/lib/api";
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

/**
 * Authenticated axios instance.
 * - Request interceptor: waits for auth to settle, then attaches `Authorization: Bearer <FirebaseIdToken>`.
 * - Response interceptor: on 401/403 from an authenticated request, signs the user out and goes to /login.
 *
 * Use this in TanStack Query hooks for any endpoint that requires login.
 */
export function useAxiosSecure(): AxiosInstance {
  const { getIdToken, signOut, loading } = useAuth();
  const router = useRouter();

  // Keep latest `loading` value accessible inside interceptors (which capture
  // `loading` at registration time otherwise).
  const loadingRef = useRef(loading);
  loadingRef.current = loading;

  const instance = useMemo(
    () =>
      axios.create({
        baseURL: apiBase(),
        timeout: 20_000,
      }),
    [],
  );

  useEffect(() => {
    const reqId = instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        // Wait briefly until Firebase Auth has finished restoring the persisted
        // session — otherwise the very first request after a hard reload would
        // fire without a token and get a 401, kicking the user out.
        const start = Date.now();
        while (loadingRef.current && Date.now() - start < 5000) {
          await new Promise((r) => setTimeout(r, 25));
        }

        const token = await getIdToken();
        const headers = (config.headers ?? {}) as Record<string, string>;
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        // Mark whether we sent an auth header so the response interceptor can
        // decide if a 401/403 should sign the user out.
        headers["X-Auth-Sent"] = token ? "1" : "0";
        config.headers = headers as typeof config.headers;
        return config;
      },
    );

    const resId = instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;
        const sentAuth = error?.config?.headers?.["X-Auth-Sent"] === "1";
        if ((status === 401 || status === 403) && sentAuth) {
          try {
            await signOut();
          } catch {
            /* ignore */
          }
          router.replace("/login");
        }
        return Promise.reject(error);
      },
    );

    return () => {
      instance.interceptors.request.eject(reqId);
      instance.interceptors.response.eject(resId);
    };
  }, [instance, getIdToken, signOut, router]);

  return instance;
}
