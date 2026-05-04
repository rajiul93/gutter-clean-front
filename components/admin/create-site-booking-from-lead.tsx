"use client";

import {
  type CallBookingRow,
  useCreateSiteBookingFromLead,
} from "@/hooks/api";
import { apiErrorMessage } from "@/lib/axios";
import type { JobSize } from "@/lib/booking-pricing";
import { getService, SERVICES, type ServiceId } from "@/lib/booking-pricing";
import type { SlotPeriod } from "@/lib/booking-slots";
import { cn, formatUsd } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

const controlClass =
  "w-full rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm font-body text-body-md text-on-background outline-none ring-primary/30 transition-shadow focus:border-primary focus:ring-2";

function defaultSlotFromLead(slot: CallBookingRow["preferredSlot"]): SlotPeriod {
  if (slot === "morning" || slot === "afternoon" || slot === "evening") return slot;
  return "morning";
}

function sizeShortLabel(size: JobSize): string {
  if (size === "small") return "Small property";
  if (size === "large") return "Large property";
  return "Medium property";
}

export function CreateSiteBookingFromLeadPanel({ lead }: { lead: CallBookingRow }) {
  const createMut = useCreateSiteBookingFromLead();
  const [contactEmail, setContactEmail] = useState(() => lead.customerEmail?.trim() ?? "");
  const [dateISO, setDateISO] = useState(() => lead.preferredDateISO?.trim() ?? "");
  const [slot, setSlot] = useState<SlotPeriod>(() => defaultSlotFromLead(lead.preferredSlot));
  const [serviceId, setServiceId] = useState(lead.serviceId);
  const [size, setSize] = useState<JobSize>("medium");
  const [featureIds, setFeatureIds] = useState<string[]>([]);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const svc = useMemo(() => getService(serviceId), [serviceId]);

  function toggleFeature(id: string) {
    setFeatureIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setFormErr(null);
    if (!dateISO || !/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
      setFormErr("Pick a valid visit date (YYYY-MM-DD) — sync it on the intake step if needed.");
      return;
    }
    try {
      const emailTrim = contactEmail.trim().toLowerCase();
      const res = await createMut.mutateAsync({
        leadId: lead._id,
        body: {
          ...(emailTrim ? { email: emailTrim } : {}),
          dateISO,
          slot,
          serviceId,
          featureIds,
          size,
          name: lead.name,
          phone: lead.phone,
          location: lead.address,
        },
      });
      setSuccessId(res.booking._id);
    } catch (err) {
      setFormErr(apiErrorMessage(err, "Could not create booking"));
    }
  }

  const latestFromLead = successId ?? lead.linkedBookingId;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-md shadow-card sm:p-lg">
      {latestFromLead ? (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50/90 p-md">
          <p className="font-heading text-sm font-bold text-emerald-950">Latest booking from this intake</p>
          <p className="mt-1 text-sm text-emerald-900/90">
            Id{" "}
            <code className="rounded bg-white/90 px-1.5 py-0.5 text-xs">{latestFromLead}</code>
            {" — "}
            also on{" "}
            <Link href="/admin" className="font-semibold text-primary underline">
              Online bookings
            </Link>
            .
          </p>
          <p className="mt-2 text-xs text-emerald-900/85">
            For the same caller again: update date (and extras if needed), then submit — each run adds another job.
            Earlier bookings stay listed in Online bookings under this phone or email.
          </p>
        </div>
      ) : null}

      <h2 className="font-heading text-lg font-bold text-primary">Confirm booking from this lead</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">
        Even if the caller has no site account, you can add a real <strong className="font-semibold">Booking</strong>{" "}
        to the main list. Optional email is stored on that record; if it matches an existing user, their{" "}
        <Link href="/dashboard" className="font-semibold text-primary underline">
          dashboard
        </Link>{" "}
        will show it too.
      </p>

      <form onSubmit={onCreate} className="mt-6 space-y-md">
        <div>
          <label className="mb-xs block font-heading text-sm font-semibold text-primary" htmlFor="sb-email">
            Contact email <span className="font-normal text-slate-500">(optional)</span>
          </label>
          <input
            id="sb-email"
            type="email"
            autoComplete="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={controlClass}
            placeholder="Leave blank for phone-only callers"
          />
          <p className="mt-1 text-xs text-slate-500">
            If left empty, we use an internal placeholder email from the phone number — no customer login required.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sb-date" className="mb-xs block font-heading text-sm font-semibold text-primary">
              Visit date
            </label>
            <input
              id="sb-date"
              type="date"
              required
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              className={controlClass}
            />
          </div>
          <div>
            <label htmlFor="sb-slot" className="mb-xs block font-heading text-sm font-semibold text-primary">
              Crew session
            </label>
            <select
              id="sb-slot"
              value={slot}
              onChange={(e) => setSlot(e.target.value as SlotPeriod)}
              className={controlClass}
            >
              <option value="morning">Morning (8–12)</option>
              <option value="afternoon">Afternoon (12–5)</option>
              <option value="evening">Evening (5–8)</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="sb-svc" className="mb-xs block font-heading text-sm font-semibold text-primary">
            Core service (same as wizard)
          </label>
          <select
            id="sb-svc"
            value={serviceId}
            onChange={(e) => {
              const next = e.target.value as ServiceId;
              setServiceId(next);
              setFeatureIds([]);
            }}
            className={controlClass}
          >
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 font-heading text-sm font-semibold text-primary">Add-ons</p>
          <ul className="space-y-2">
            {svc.features.map((f) => (
              <li key={f.id}>
                <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={featureIds.includes(f.id)}
                    onChange={() => toggleFeature(f.id)}
                    className="mt-1 accent-primary"
                  />
                  <span className="text-sm">
                    <span className="font-semibold text-slate-800">{f.label}</span>
                    <span className="ml-2 text-xs text-slate-500">{formatUsd(f.price)}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <label htmlFor="sb-size" className="mb-xs block font-heading text-sm font-semibold text-primary">
            Job size multiplier
          </label>
          <select
            id="sb-size"
            value={size}
            onChange={(e) => setSize(e.target.value as JobSize)}
            className={controlClass}
          >
            {(["small", "medium", "large"] as JobSize[]).map((sz) => (
              <option key={sz} value={sz}>
                {sizeShortLabel(sz)}
              </option>
            ))}
          </select>
        </div>

        {formErr ? (
          <p className="text-sm font-medium text-error" role="alert">
            {formErr}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={createMut.isPending}
          className={cn(
            "rounded-2xl bg-primary px-xl py-md font-heading text-label-sm text-white transition hover:bg-secondary disabled:opacity-60",
          )}
        >
          {createMut.isPending
            ? "Creating…"
            : latestFromLead
              ? "Create another booking"
              : "Create dashboard booking"}
        </button>
      </form>
    </section>
  );
}
