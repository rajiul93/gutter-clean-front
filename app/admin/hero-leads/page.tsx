"use client";

import { useAdminHeroLeads, usePatchHeroLeadCallback, type HeroLeadRow } from "@/hooks/api";
import { apiErrorMessage } from "@/lib/axios";
import { useState } from "react";

function telHref(phone: string): string {
  const t = phone.trim();
  return t ? `tel:${encodeURIComponent(t)}` : "#";
}

export default function AdminHeroLeadsPage() {
  const [page, setPage] = useState(1);
  const limit = 20;
  const { data, isPending, isFetching, error } = useAdminHeroLeads({ page, limit });
  const patch = usePatchHeroLeadCallback();
  const [actionErr, setActionErr] = useState<string | null>(null);

  const totalPages = data && data.total > 0 ? Math.max(1, Math.ceil(data.total / limit)) : 1;

  async function onCallbackChange(row: HeroLeadRow, next: boolean) {
    if (row.callback === next) return;
    setActionErr(null);
    try {
      await patch.mutateAsync({ id: row._id, callback: next });
    } catch (err) {
      setActionErr(apiErrorMessage(err, "Could not update callback flag."));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary">Hero quote requests</h1>
        <p className="mt-1 text-sm text-slate-600">
          Submissions from the homepage hero form. Set <strong className="font-semibold text-slate-700">Callback</strong>{" "}
          when you’ve reached the customer by phone or plan to call back.
        </p>
      </div>

      {actionErr ? (
        <p className="text-sm font-medium text-error" role="alert">
          {actionErr}
        </p>
      ) : null}

      {error ? (
        <p className="text-sm font-medium text-error">{apiErrorMessage(error, "Failed to load list")}</p>
      ) : null}

      {isPending ? (
        <p className="text-slate-500">Loading…</p>
      ) : !data || data.items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">No hero submissions yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-heading text-label-sm uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="whitespace-nowrap px-3 py-3">Received</th>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="min-w-[12rem] px-3 py-3">Location</th>
                  <th className="whitespace-nowrap px-3 py-3">Callback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body text-body-sm text-slate-700">
                {data.items.map((row) => (
                  <tr key={row._id} className="align-top hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs text-slate-500 tabular-nums">
                      {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-3 py-2.5 font-medium">{row.name || "—"}</td>
                    <td className="px-3 py-2.5">
                      {row.phone.trim() ? (
                        <a
                          href={telHref(row.phone)}
                          className="font-semibold text-primary underline-offset-2 hover:underline tabular-nums"
                        >
                          {row.phone}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="max-w-[20rem] px-3 py-2.5">
                      <p className="whitespace-pre-wrap break-words">{row.location || "—"}</p>
                    </td>
                    <td className="px-3 py-2.5">
                      <label className="sr-only" htmlFor={`cb-${row._id}`}>
                        Callback — {row.name}
                      </label>
                      <select
                        id={`cb-${row._id}`}
                        value={String(row.callback)}
                        disabled={patch.isPending && patch.variables?.id === row._id}
                        onChange={(e) => void onCallbackChange(row, e.target.value === "true")}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:opacity-60"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </td>
                  </tr>
                ))}
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
