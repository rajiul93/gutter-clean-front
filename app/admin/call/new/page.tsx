"use client";

import {
  deriveCallBookingStep,
  emptyCallBookingForm,
  rowToFormValues,
  type CallBookingFormValues,
} from "@/components/admin/call-booking-form";
import { PhoneCallBookingWizard } from "@/components/admin/call-phone-booking-steps";
import {
  useCreateCallBooking,
  useLookupCallBookingByPhone,
  usePatchCallBooking,
  type CallBookingPreferredSlot,
  type CallBookingRow,
} from "@/hooks/api";
import { useAxiosSecure } from "@/hooks/use-axios-secure";
import { apiErrorMessage, type ApiEnvelope } from "@/lib/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

function scheduleComplete(v: CallBookingFormValues): v is CallBookingFormValues & {
  preferredSlot: CallBookingPreferredSlot;
} {
  return v.preferredDateISO.trim().length > 0 && v.preferredSlot !== "";
}

function buildCreateBody(v: CallBookingFormValues & { preferredSlot: CallBookingPreferredSlot }) {
  return {
    name: v.name.trim(),
    phone: v.phone.trim(),
    serviceId: v.serviceId,
    preferredDateISO: v.preferredDateISO.trim(),
    preferredSlot: v.preferredSlot,
    address: v.address.trim(),
    notes: v.notes.trim() || undefined,
    customerEmail: v.customerEmail.trim().toLowerCase() || undefined,
  };
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

export default function NewCallBookingPage() {
  const router = useRouter();
  const axios = useAxiosSecure();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [values, setValues] = useState<CallBookingFormValues>(() => emptyCallBookingForm());
  /** When set, submit PATCHes this record (repeat caller or after create conflict). */
  const [activeId, setActiveId] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);
  const [submitErr, setSubmitErr] = useState<string | null>(null);

  const lookup = useLookupCallBookingByPhone();
  const createMut = useCreateCallBooking();
  const patchMut = usePatchCallBooking();

  function patchWizard(patch: Partial<CallBookingFormValues>) {
    setValues((prev) => {
      const next = { ...prev, ...patch };
      if (patch.phone !== undefined && next.phone.trim() !== prev.phone.trim()) {
        setActiveId(null);
      }
      return next;
    });
    setBanner(null);
  }

  function replaceWizard(next: CallBookingFormValues) {
    setValues((prev) => {
      if (next.phone.trim() !== prev.phone.trim()) {
        setActiveId(null);
      }
      return next;
    });
    setBanner(null);
  }

  async function onLookup() {
    setSubmitErr(null);
    const phone = values.phone.trim();
    if (!phone) {
      setBanner(null);
      return;
    }
    try {
      const row = await lookup.mutateAsync(phone);
      if (row) {
        const filled = rowToFormValues(row);
        setValues(filled);
        setActiveId(row._id);
        setStep(deriveCallBookingStep(filled));
        setBanner(
          "A saved record exists for this number — we jumped to the step that still needs checks. Save to update.",
        );
      } else {
        setActiveId(null);
        setBanner(null);
      }
    } catch (e) {
      setSubmitErr(apiErrorMessage(e, "Lookup failed"));
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitErr(null);
    if (step !== 3) return;

    if (!scheduleComplete(values)) {
      setSubmitErr("Choose a date and time session (step 2) before saving.");
      setStep(2);
      return;
    }

    const withSchedule = values;

    if (activeId) {
      try {
        await patchMut.mutateAsync({ id: activeId, body: buildPatchBody(withSchedule) });
        router.push(`/admin/call/${activeId}`);
      } catch (err) {
        setSubmitErr(apiErrorMessage(err, "Could not save"));
      }
      return;
    }

    try {
      const res = await createMut.mutateAsync(buildCreateBody(withSchedule));
      if (res.outcome === "created") {
        router.push(`/admin/call/${res.row._id}`);
        return;
      }
      try {
        const { data } = await axios.get<ApiEnvelope<CallBookingRow>>(
          `/api/v1/admin/call-bookings/${res.existingId}`,
        );
        const filled = rowToFormValues(data.data);
        setValues(filled);
        setActiveId(res.existingId);
        setStep(deriveCallBookingStep(filled));
        setBanner(
          "This phone number already exists — details are loaded. Review the steps, then save to update.",
        );
      } catch (getErr) {
        setSubmitErr(
          apiErrorMessage(getErr, "Could not load the existing record. Try the list or look up by phone."),
        );
      }
    } catch (err) {
      setSubmitErr(apiErrorMessage(err, "Could not save"));
    }
  }

  const busy = lookup.isPending || createMut.isPending || patchMut.isPending;

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/call"
          className="text-sm font-semibold text-primary hover:underline"
        >
          ← Phone call bookings
        </Link>
        <h1 className="mt-2 font-heading text-2xl font-bold text-primary">Phone booking (admin)</h1>
        <p className="mt-1 text-sm text-slate-600">
          Walk through the same order you use on the website — service, date &amp; session, then caller
          details — while you are on the line.
        </p>
      </div>

      <form onSubmit={onSubmit} className="not-prose w-full max-w-3xl space-y-6">
        <PhoneCallBookingWizard
          step={step}
          onStepChange={setStep}
          values={values}
          patchValues={patchWizard}
          replaceValues={replaceWizard}
          idPrefix="new-call"
          phoneExtra={
            <button
              type="button"
              onClick={() => void onLookup()}
              disabled={lookup.isPending || !values.phone.trim()}
              className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 font-heading text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              {lookup.isPending ? "Looking up…" : "Look up by phone"}
            </button>
          }
          banner={banner ?? undefined}
        />

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
              {activeId ? "Save updates" : "Create booking"}
            </button>
            <Link
              href="/admin/call"
              className="inline-flex items-center rounded-2xl border border-slate-200 px-xl py-md font-heading text-label-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        ) : null}
      </form>
    </div>
  );
}
