"use client";

import {
  deriveCallBookingStep,
  rowToFormValues,
  type CallBookingFormValues,
} from "@/components/admin/call-booking-form";
import { PhoneCallBookingWizard } from "@/components/admin/call-phone-booking-steps";
import { CreateSiteBookingFromLeadPanel } from "@/components/admin/create-site-booking-from-lead";
import {
  callBookingDetailKey,
  useCallBooking,
  usePatchCallBooking,
  type CallBookingPreferredSlot,
  type CallBookingRow,
} from "@/hooks/api";
import { apiErrorMessage } from "@/lib/axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";

function scheduleComplete(v: CallBookingFormValues): v is CallBookingFormValues & {
  preferredSlot: CallBookingPreferredSlot;
} {
  return v.preferredDateISO.trim().length > 0 && v.preferredSlot !== "";
}

function buildPatchBody(v: CallBookingFormValues & { preferredSlot: CallBookingPreferredSlot }) {
  return {
    name: v.name.trim(),
    phone: v.phone.trim(),
    serviceId: v.serviceId,
    preferredDateISO: v.preferredDateISO.trim(),
    preferredSlot: v.preferredSlot,
    address: v.address.trim(),
    notes: v.notes.trim() ? v.notes.trim() : null,
    customerEmail: v.customerEmail.trim().toLowerCase()
      ? v.customerEmail.trim().toLowerCase()
      : null,
  };
}

/** Step-by-step edits to phone-intake capture (stored in Mongo `Booking`‑separate `CallBooking` collection). */
function PhoneLeadIntakeForm({ leadId, lead }: { leadId: string; lead: CallBookingRow }) {
  const qc = useQueryClient();
  const patchMut = usePatchCallBooking();
  const [step, setStep] = useState<1 | 2 | 3>(() => deriveCallBookingStep(rowToFormValues(lead)));
  const [values, setValues] = useState<CallBookingFormValues>(() => rowToFormValues(lead));
  const [submitErr, setSubmitErr] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState(false);

  function patchWizard(patch: Partial<CallBookingFormValues>) {
    setValues((prev) => ({ ...prev, ...patch }));
  }

  function replaceWizard(next: CallBookingFormValues) {
    setValues(next);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitErr(null);
    setSaveOk(false);
    if (step !== 3) return;

    if (!scheduleComplete(values)) {
      setSubmitErr("Choose a date and crew session on step 2 before saving.");
      setStep(2);
      return;
    }

    try {
      await patchMut.mutateAsync({ id: leadId, body: buildPatchBody(values) });
      await qc.invalidateQueries({ queryKey: callBookingDetailKey(leadId) });
      setSaveOk(true);
    } catch (err) {
      setSubmitErr(apiErrorMessage(err, "Could not save"));
    }
  }

  const busy = patchMut.isPending;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-1 shadow-inner sm:bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="font-heading text-base font-bold text-primary sm:text-lg">
          Phone intake lead (separate store)
        </h2>
        <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">
          Call notes and preferences only — below, create the real site booking that appears in lists and (when
          linked) the customer dashboard.
        </p>
      </div>
      <div className="p-4 sm:p-5">
        <form onSubmit={onSubmit} className="space-y-6">
          <PhoneCallBookingWizard
            step={step}
            onStepChange={setStep}
            values={values}
            patchValues={patchWizard}
            replaceValues={replaceWizard}
            idPrefix={`call-${leadId}`}
          />

          {saveOk ? (
            <p className="text-sm font-medium text-emerald-800" role="status">
              Lead saved — you can create the dashboard booking below.
            </p>
          ) : null}
          {submitErr ? (
            <p className="text-sm font-medium text-error" role="alert">
              {submitErr}
            </p>
          ) : null}

          {step === 3 ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={busy}
                className="rounded-2xl bg-primary px-xl py-md font-heading text-label-sm text-white transition-all hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                Save lead / intake only
              </button>
              <Link
                href="/admin/call"
                className="inline-flex items-center rounded-2xl border border-slate-200 px-xl py-md font-heading text-label-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back to list
              </Link>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}

export default function EditCallBookingPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : undefined;
  const { data, isPending, error } = useCallBooking(id);

  if (!id) {
    return (
      <p className="text-slate-600">
        Invalid link.{" "}
        <Link href="/admin/call" className="font-semibold text-primary">
          Back to list
        </Link>
      </p>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-error">{apiErrorMessage(error, "Failed to load")}</p>
        <Link href="/admin/call" className="text-sm font-semibold text-primary">
          ← Back to list
        </Link>
      </div>
    );
  }

  if (isPending || !data) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/call"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Phone call bookings
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold text-primary">
          Phone lead &amp; site booking
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          <span className="font-medium text-slate-800">{data.name}</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="tabular-nums">{data.phone}</span>
        </p>
      </div>

      <PhoneLeadIntakeForm
        key={`${data._id}-${data.updatedAt ?? ""}-${data.linkedBookingId ?? ""}`}
        leadId={id}
        lead={data}
      />

      <div>
        <h2 className="sr-only">Dashboard booking from this lead</h2>
        <CreateSiteBookingFromLeadPanel
          key={`${data._id}-${data.updatedAt ?? ""}-${data.linkedBookingId ?? "pending"}`}
          lead={data}
        />
      </div>
    </div>
  );
}
