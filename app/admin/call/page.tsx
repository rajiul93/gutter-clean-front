"use client";

import { useCallBookingsList } from "@/hooks/api";
import { describePhoneCallSchedule } from "@/components/admin/call-booking-form";
import { apiErrorMessage } from "@/lib/axios";
import Link from "next/link";
import { useState } from "react";

function telHref(phone: string): string {
  const t = phone.trim();
  return t ? `tel:${encodeURIComponent(t)}` : "#";
}

export default function AdminCallBookingsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isPending, isFetching, error } = useCallBookingsList({ page, limit });

  const totalPages = data && data.total > 0 ? Math.max(1, Math.ceil(data.total / limit)) : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">Phone call bookings</h1>
          <p className="mt-1 text-sm text-slate-600">
            Phone-call <strong className="font-semibold text-slate-700">intake leads</strong> (separate DB
            collection from online bookings). Open a row: save intake, then optional dashboard booking.
          </p>
        </div>
        <Link
          href="/admin/call/new"
          className="rounded-xl bg-primary px-4 py-2.5 font-heading text-sm font-bold text-white transition hover:brightness-110"
        >
          New booking
        </Link>
      </div>

      {error ? (
        <p className="text-sm font-medium text-error">{apiErrorMessage(error, "Failed to load list")}</p>
      ) : null}

      {isPending ? (
        <p className="text-slate-500">Loading…</p>
      ) : !data || data.items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          No phone bookings yet.{" "}
          <Link href="/admin/call/new" className="font-semibold text-primary underline">
            Add one
          </Link>
          .
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[24rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-heading text-label-sm uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3 w-14" aria-label="Open details" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body text-body-sm text-slate-700">
                {data.items.map((row) => {
                  const sched = describePhoneCallSchedule(row);
                  return (
                  <tr key={row._id} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-medium">{row.name || "—"}</span>
                        {row.linkedBookingId ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-900">
                            Site booking ✓
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-950">
                            Lead only
                          </span>
                        )}
                      </div>
                      {sched ? (
                        <p className="mt-0.5 text-xs text-slate-500">{sched}</p>
                      ) : null}
                    </td>
                    <td className="px-3 py-2.5">
                      {row.phone.trim() ? (
                        <a
                          href={telHref(row.phone)}
                          className="tabular-nums font-semibold text-primary underline-offset-2 hover:underline"
                        >
                          {row.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <Link
                        href={`/admin/call/${row._id}`}
                        className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-lg transition hover:border-primary/40 hover:bg-primary/5"
                        aria-label={`View or edit ${row.name || "customer"}`}
                        title="View or edit details"
                      >
                        👁️
                      </Link>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
            <p className="text-sm text-slate-600">
              Page {data.page} of {totalPages} · {data.total} total
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {isFetching && !isPending ? (
        <p className="text-xs text-slate-500" aria-live="polite">
          Refreshing…
        </p>
      ) : null}
    </div>
  );
}
