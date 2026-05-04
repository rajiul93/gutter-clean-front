"use client";

import type { ReactNode } from "react";
import { SERVICES } from "@/lib/booking-pricing";
import type { ServiceId } from "@/lib/booking-pricing";
import type {
  CallBookingPreferredSlot,
  CallBookingRow,
} from "@/hooks/api/use-call-bookings";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm font-body text-body-md text-on-background outline-none ring-primary/30 transition-shadow focus:border-primary focus:ring-2";

/** Slot not chosen yet on step 2 (before admin picks morning/afternoon/evening/flexible). */
export type CallBookingPreferredSlotUnset = "";

export type CallBookingFormValues = {
  name: string;
  phone: string;
  /** Optional — if saved and matches an existing User, converting to a Booking can auto-link their dashboard. */
  customerEmail: string;
  serviceId: ServiceId;
  preferredDateISO: string;
  preferredSlot: CallBookingPreferredSlot | CallBookingPreferredSlotUnset;
  address: string;
  notes: string;
};

export function emptyCallBookingForm(): CallBookingFormValues {
  return {
    name: "",
    phone: "",
    customerEmail: "",
    serviceId: "gutter",
    preferredDateISO: "",
    preferredSlot: "",
    address: "",
    notes: "",
  };
}

export function rowToFormValues(row: CallBookingRow): CallBookingFormValues {
  return {
    name: row.name,
    phone: row.phone,
    customerEmail: row.customerEmail ?? "",
    serviceId: row.serviceId,
    preferredDateISO: row.preferredDateISO ?? "",
    preferredSlot: row.preferredSlot,
    address: row.address,
    notes: row.notes ?? "",
  };
}

/** Which wizard step matches the captured data — for edit / partial records. */
export function deriveCallBookingStep(v: CallBookingFormValues): 1 | 2 | 3 {
  const svc = String(v.serviceId ?? "").trim();
  if (!svc) return 1;
  if (!v.preferredDateISO.trim() || v.preferredSlot === "") return 2;
  return 3;
}

/** English line for listings (Bangla UI text can wrap this elsewhere). */
export function describePhoneCallSchedule(row: CallBookingRow): string | null {
  const slots: Record<CallBookingPreferredSlot, string> = {
    morning: "Morning (8 AM – 12 PM)",
    afternoon: "Afternoon (12 PM – 5 PM)",
    evening: "Evening (5 PM – 8 PM)",
    flexible: "Flexible anytime that day",
  };
  const slotTxt = slots[row.preferredSlot] ?? row.preferredSlot;
  if (row.preferredDateISO?.trim()) {
    const d = new Date(`${row.preferredDateISO.trim()}T12:00:00`);
    const day = d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return `${day} · ${slotTxt}`;
  }
  return slotTxt || null;
}

type CallBookingContactFieldsProps = {
  values: CallBookingFormValues;
  onChange: (next: CallBookingFormValues) => void;
  idPrefix: string;
  phoneExtra?: ReactNode;
};

/** Step 3: name, phone, address, notes (admin taking the call). */
export function CallBookingContactFields({
  values,
  onChange,
  idPrefix,
  phoneExtra,
}: CallBookingContactFieldsProps) {
  function patch<K extends keyof CallBookingFormValues>(key: K, value: CallBookingFormValues[K]) {
    onChange({ ...values, [key]: value });
  }

  return (
    <div className="space-y-md">
      <div>
        <label
          htmlFor={`${idPrefix}-name`}
          className="mb-xs block font-heading text-sm font-semibold text-primary"
        >
          Customer name
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => patch("name", e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-phone`}
          className="mb-xs block font-heading text-sm font-semibold text-primary"
        >
          Phone
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            autoComplete="tel"
            required
            value={values.phone}
            onChange={(e) => patch("phone", e.target.value)}
            className={cn(inputClass, "sm:flex-1")}
          />
          {phoneExtra}
        </div>
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-customer-email`}
          className="mb-xs block font-heading text-sm font-semibold text-primary"
        >
          Contact email
          <span className="ml-1 font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id={`${idPrefix}-customer-email`}
          type="email"
          autoComplete="email"
          placeholder="If known — admins can confirm bookings without a web account"
          value={values.customerEmail}
          onChange={(e) => patch("customerEmail", e.target.value)}
          className={inputClass}
        />
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          If this email matches an existing site account, confirming a dashboard booking links it there; otherwise
          the job appears only under admin Online bookings.
        </p>
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-address`}
          className="mb-xs block font-heading text-sm font-semibold text-primary"
        >
          Address
        </label>
        <textarea
          id={`${idPrefix}-address`}
          required
          rows={3}
          value={values.address}
          onChange={(e) => patch("address", e.target.value)}
          className={cn(inputClass, "resize-y")}
          placeholder="Job site — where the crew should go"
        />
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-notes`}
          className="mb-xs block font-heading text-sm font-semibold text-primary"
        >
          Notes <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <textarea
          id={`${idPrefix}-notes`}
          rows={3}
          value={values.notes}
          onChange={(e) => patch("notes", e.target.value)}
          className={cn(inputClass, "resize-y")}
        />
      </div>
    </div>
  );
}

type CallBookingStep1ServiceProps = {
  serviceId: ServiceId;
  onSelect: (id: ServiceId) => void;
};

/** Step 1: pick core service — mirrors public booking wizard step order. */
export function CallBookingStepPickService({ serviceId, onSelect }: CallBookingStep1ServiceProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-bold text-primary sm:text-xl">Service type</h2>
        <p className="mt-1 text-sm text-slate-600">
          Ask the caller which job they want — online customers pick this first too.
        </p>
      </div>
      <ul className="grid gap-2 sm:gap-3">
        {SERVICES.map((s) => {
          const active = serviceId === s.id;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s.id)}
                className={cn(
                  "w-full rounded-2xl border-2 px-4 py-3 text-left transition sm:px-5 sm:py-4",
                  active
                    ? "border-primary bg-primary text-white shadow-md"
                    : "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50",
                )}
              >
                <span className="block font-heading text-sm font-bold sm:text-base">{s.title}</span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs leading-snug sm:text-sm",
                    active ? "text-white/90" : "text-slate-600",
                  )}
                >
                  {s.description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
