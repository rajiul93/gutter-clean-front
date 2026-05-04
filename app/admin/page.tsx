"use client";

import {
  useAdminBookings,
  useUpdateAdminBookingStatus,
  type AdminBookingRow,
  type PatchAdminBookingStatusInput,
} from "@/hooks/api";
import { apiErrorMessage } from "@/lib/axios";
import { getService } from "@/lib/booking-pricing";
import { formatUsd } from "@/lib/utils";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { VoucherDownloadGroup } from "@/components/voucher";
import { Eye, Loader2, Phone } from "lucide-react";
import { useState } from "react";

function userLabel(row: AdminBookingRow): string {
  const u = row.userId;
  if (u && typeof u === "object") {
    return u.email ?? u.displayName ?? "—";
  }
  if (typeof u === "string" && u.length > 0) {
    return u;
  }
  return "Phone (no account)";
}

function slotLabel(slot: string): string {
  if (!slot) return "—";
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

function telHref(phone: string): string {
  const t = phone.trim();
  return t ? `tel:${encodeURIComponent(t)}` : "#";
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_progress: "In progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[s] ?? s;
}

function statusBadgeClass(s: string): string {
  if (s === "completed") return "bg-emerald-100 text-emerald-900";
  if (s === "confirmed") return "bg-sky-100 text-sky-900";
  if (s === "in_progress") return "bg-violet-100 text-violet-900";
  if (s === "cancelled") return "bg-red-100 text-red-900";
  return "bg-amber-100 text-amber-950";
}

function nextActions(status: string): { label: string; status: PatchAdminBookingStatusInput["status"] }[] {
  if (status === "pending") {
    return [
      { label: "Confirm", status: "confirmed" },
      { label: "Cancel", status: "cancelled" },
    ];
  }
  if (status === "confirmed") {
    return [
      { label: "Start", status: "in_progress" },
      { label: "Cancel", status: "cancelled" },
    ];
  }
  if (status === "in_progress") {
    return [
      { label: "Finish", status: "completed" },
      { label: "Cancel", status: "cancelled" },
    ];
  }
  return [];
}

function BookingDetailsBody({ row }: { row: AdminBookingRow }) {
  const svc =
    row.serviceId === "gutter" ||
    row.serviceId === "roof" ||
    row.serviceId === "downpipe" ||
    row.serviceId === "inspect"
      ? getService(row.serviceId)
      : null;
  const featureLabels =
    svc && row.featureIds?.length
      ? row.featureIds
          .map((id) => svc.features.find((f) => f.id === id)?.label)
          .filter(Boolean)
          .join(", ")
      : "—";

  const rows: { k: string; v: string }[] = [
    { k: "Date", v: row.dateISO },
    { k: "Slot", v: slotLabel(row.slot) },
    { k: "Status", v: statusLabel(String(row.status)) },
    { k: "Account", v: userLabel(row) },
    { k: "Customer name", v: row.name },
    { k: "Email", v: row.email },
    { k: "Phone", v: row.phone },
    { k: "Location", v: row.location },
    { k: "Service", v: svc?.title ?? row.serviceId },
    { k: "Add-ons", v: featureLabels },
    { k: "Job size", v: row.size ? String(row.size) : "—" },
    { k: "Total", v: formatUsd(row.total) },
    { k: "Booked at", v: row.createdAt ? new Date(row.createdAt).toLocaleString() : "—" },
  ];

  const fullWidth = new Set(["Location", "Add-ons", "Booked at"]);

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {rows.map(({ k, v }) => (
        <div key={k} className={fullWidth.has(k) ? "min-w-0 sm:col-span-2" : "min-w-0"}>
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{k}</dt>
          <dd
            className={
              k === "Location"
                ? "mt-0.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-900"
                : "mt-0.5 break-words text-sm text-slate-900"
            }
          >
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function AdminBookingsPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [detailRow, setDetailRow] = useState<AdminBookingRow | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);

  const { data, isPending, isFetching, error } = useAdminBookings({
    page,
    limit,
    dateFrom: appliedFrom || undefined,
    dateTo: appliedTo || undefined,
  });

  const updateStatus = useUpdateAdminBookingStatus();

  function applyDateFilter(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setAppliedFrom(dateFrom);
    setAppliedTo(dateTo);
  }

  function clearDates() {
    setDateFrom("");
    setDateTo("");
    setAppliedFrom("");
    setAppliedTo("");
    setPage(1);
  }

  async function onStatusChange(id: string, status: PatchAdminBookingStatusInput["status"]) {
    setActionErr(null);
    try {
      await updateStatus.mutateAsync({ id, status });
    } catch (err: unknown) {
      setActionErr(apiErrorMessage(err, "Could not update status."));
    }
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1;
  const rowBusy = (id: string) =>
    updateStatus.isPending && updateStatus.variables?.id === id;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-heading text-h2 text-primary">Bookings</h1>
        <p className="mt-1 font-body text-body-md text-slate-600">
          Review and filter all customer bookings (newest scheduled dates first).
        </p>
      </header>

      <form
        onSubmit={applyDateFilter}
        className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]"
      >
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600" htmlFor="df">
            From (YYYY-MM-DD)
          </label>
          <input
            id="df"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-600" htmlFor="dt">
            To (YYYY-MM-DD)
          </label>
          <input
            id="dt"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 font-heading text-sm font-bold text-white hover:bg-secondary"
        >
          Apply filter
        </button>
        <button
          type="button"
          onClick={clearDates}
          className="rounded-xl border border-slate-200 px-4 py-2 font-heading text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Clear dates
        </button>
        {isFetching && !isPending ? (
          <span className="text-xs text-slate-500">Refreshing…</span>
        ) : null}
      </form>

      {error ? (
        <p className="text-sm font-medium text-error">
          {apiErrorMessage(error, "Failed to load bookings")}
        </p>
      ) : null}
      {actionErr ? (
        <p className="text-sm font-medium text-error">{actionErr}</p>
      ) : null}

      {isPending ? (
        <p className="text-slate-500">Loading…</p>
      ) : !data || data.items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
          No bookings found.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-heading text-label-sm uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Slot</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body text-body-sm text-slate-700">
                {data.items.map((b) => {
                  const busy = rowBusy(b._id);
                  const actions = nextActions(String(b.status));
                  return (
                    <tr key={b._id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-2.5 whitespace-nowrap font-medium">{b.dateISO}</td>
                      <td className="px-3 py-2.5 capitalize">{slotLabel(b.slot)}</td>
                      <td className="px-3 py-2.5">
                        {b.phone.trim() ? (
                          <a
                            href={telHref(b.phone)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                            aria-label={`Call ${b.phone}`}
                          >
                            <Phone className="size-4 shrink-0" aria-hidden />
                            <span className="tabular-nums">{b.phone}</span>
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadgeClass(String(b.status))}`}
                          >
                            {statusLabel(String(b.status))}
                          </span>
                          {actions.map((a) => (
                            <button
                              key={a.status}
                              type="button"
                              disabled={busy}
                              onClick={() => onStatusChange(b._id, a.status)}
                              className={
                                a.status === "cancelled"
                                  ? "rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                  : "rounded-lg bg-primary-container px-2.5 py-1 text-xs font-bold text-white hover:brightness-110 disabled:opacity-50"
                              }
                            >
                              {a.label}
                            </button>
                          ))}
                          {busy ? (
                            <Loader2 className="size-4 shrink-0 animate-spin text-slate-400" aria-hidden />
                          ) : null}
                          {String(b.status) === "completed" ? (
                            <VoucherDownloadGroup row={b} variant="outline" compact />
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setDetailRow(b)}
                            className="inline-flex size-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                            aria-label="View booking details"
                          >
                            <Eye className="size-4" aria-hidden />
                          </button>
                        </div>
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

      <Dialog
        open={!!detailRow}
        onOpenChange={(open) => {
          if (!open) setDetailRow(null);
        }}
        title="Booking details"
        description={detailRow ? `${detailRow.dateISO} · ${slotLabel(detailRow.slot)}` : undefined}
        size="w-[min(100%,42rem)] sm:max-w-3xl"
      >
        {detailRow ? (
          <>
            <BookingDetailsBody row={detailRow} />
            {String(detailRow.status) === "completed" ? (
              <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/80 p-4">
                <p className="mb-3 font-heading text-sm font-bold text-emerald-950">
                  Service completed — download voucher
                </p>
                <p className="mb-3 text-xs leading-relaxed text-emerald-900/90">
                  Customer and office can each keep a labelled PDF copy.
                </p>
                <VoucherDownloadGroup row={detailRow} variant="outline" />
              </div>
            ) : null}
            <DialogFooter className="!mt-4">
              <button
                type="button"
                onClick={() => setDetailRow(null)}
                className="rounded-xl bg-primary px-5 py-2 font-heading text-sm font-bold text-white hover:bg-secondary"
              >
                Close
              </button>
            </DialogFooter>
          </>
        ) : null}
      </Dialog>
    </div>
  );
}
