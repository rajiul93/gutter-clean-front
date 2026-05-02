"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { useMyAddress, useMyBookings, useUpsertAddress } from "@/hooks/api";
import { apiErrorMessage } from "@/lib/axios";
import { formatUsd } from "@/lib/utils";
import { VoucherDownloadGroup } from "@/components/voucher";
import { CalendarDays, Mail, MapPin, Pencil, Phone, Plus, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  location: "",
};

export default function DashboardPage() {
  const { firebaseUser, profile } = useAuth();
  const addressQuery = useMyAddress();
  const bookingsQuery = useMyBookings({ limit: 50 });
  const upsertAddress = useUpsertAddress();

  const address = addressQuery.data ?? null;
  const bookings = bookingsQuery.data?.items ?? [];
  const loading = addressQuery.isPending || bookingsQuery.isPending;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    const t = window.setTimeout(() => {
      if (address) {
        setForm({
          name: address.name ?? "",
          email: address.email ?? "",
          phone: address.phone ?? "",
          location: address.location ?? "",
        });
      } else if (addressQuery.isFetched) {
        setForm({
          ...EMPTY_FORM,
          name: profile?.displayName ?? firebaseUser?.displayName ?? "",
          email: firebaseUser?.email ?? "",
        });
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [address, addressQuery.isFetched, firebaseUser, profile]);

  function openAddressDialog() {
    setSaveErr(null);
    setDialogOpen(true);
  }

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    setSaveErr(null);
    try {
      await upsertAddress.mutateAsync({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
      });
      setDialogOpen(false);
    } catch (err: unknown) {
      setSaveErr(apiErrorMessage(err, "Could not save address."));
    }
  }

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-h2 text-primary">Dashboard</h1>
          <p className="mt-1 font-body text-body-md text-slate-600">
            Signed in as{" "}
            <span className="font-semibold text-slate-800">
              {profile?.email ?? firebaseUser?.email}
            </span>
          </p>
        </div>
        <Link
          href="/book"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 font-heading text-sm font-bold text-white hover:bg-secondary"
        >
          <Plus className="size-4" aria-hidden />
          New booking
        </Link>
      </header>

      <section id="address" className="scroll-mt-24">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-h3 text-primary-container">Saved address</h2>
          <button
            type="button"
            onClick={openAddressDialog}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 font-heading text-sm font-semibold text-slate-700 transition hover:border-primary/40 hover:text-primary"
          >
            <Pencil className="size-3.5" aria-hidden />
            {address ? "Edit address" : "Add address"}
          </button>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
          {addressQuery.isPending ? (
            <p className="text-sm text-slate-500">Loading address…</p>
          ) : address ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Name</dt>
                  <dd className="mt-0.5 font-body text-body-md font-semibold text-slate-900">
                    {address.name}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
                  <dd className="mt-0.5 truncate font-body text-body-md text-slate-700">
                    {address.email}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Phone</dt>
                  <dd className="mt-0.5 font-body text-body-md text-slate-700">{address.phone}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Location
                  </dt>
                  <dd className="mt-0.5 font-body text-body-md leading-relaxed text-slate-700">
                    {address.location}
                  </dd>
                </div>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-slate-600">
              You haven&apos;t saved an address yet. Adding one helps us serve you faster on future
              bookings.
            </p>
          )}
        </div>
      </section>

      <section id="bookings" className="scroll-mt-24">
        <h2 className="mb-4 font-heading text-h3 text-primary-container">Your bookings</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading bookings…</p>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CalendarDays className="size-5" aria-hidden />
            </span>
            <p className="font-body text-body-md text-slate-700">You have no bookings yet.</p>
            <Link
              href="/book"
              className="font-heading text-sm font-semibold text-primary hover:underline"
            >
              Book a service →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-[var(--shadow-card)]">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 font-heading text-label-sm uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Slot</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Job site</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Voucher</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-body text-body-sm text-slate-700">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 whitespace-nowrap">{b.dateISO}</td>
                    <td className="px-4 py-3 capitalize">{b.slot}</td>
                    <td className="px-4 py-3 capitalize">{b.serviceId}</td>
                    <td className="max-w-[16rem] truncate px-4 py-3" title={b.location}>
                      {b.location}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatUsd(b.total)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          b.status === "completed"
                            ? "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800"
                            : b.status === "confirmed"
                              ? "rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-900"
                              : b.status === "in_progress"
                                ? "rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-900"
                                : b.status === "cancelled"
                                  ? "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800"
                                  : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900"
                        }
                      >
                        {b.status === "in_progress"
                          ? "in progress"
                          : b.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {b.status === "completed" ? (
                        <VoucherDownloadGroup
                          row={b}
                          copies={["customer"]}
                          variant="outline"
                          compact
                        />
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        size="sm:max-w-2xl"
        title={address ? "Edit address" : "Add address"}
        description="We&rsquo;ll use this name, contact, and location for your future bookings."
      >
        <form onSubmit={saveAddress} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="ad-name">
                Name
              </label>
              <input
                id="ad-name"
                required
                autoFocus
                autoComplete="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>
            <div className="min-w-0">
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="ad-phone">
                Phone
              </label>
              <input
                id="ad-phone"
                type="tel"
                required
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="ad-email">
              Email
            </label>
            <input
              id="ad-email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="ad-location">
              Location
            </label>
            <textarea
              id="ad-location"
              required
              rows={3}
              autoComplete="street-address"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="e.g. 142 Oak Street, Portland, ME 04101 — blue house, side driveway, gate code 4821"
              className="min-h-[5rem] w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm leading-snug outline-none ring-primary/30 placeholder:text-slate-400 focus:ring-2"
            />
          </div>
          {saveErr ? <p className="text-sm font-medium text-error">{saveErr}</p> : null}
          <DialogFooter>
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 font-heading text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={upsertAddress.isPending}
              className="rounded-xl bg-primary px-5 py-2 font-heading text-sm font-bold text-white hover:bg-secondary disabled:opacity-60"
            >
              {upsertAddress.isPending
                ? "Saving…"
                : address
                  ? "Update address"
                  : "Save address"}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
