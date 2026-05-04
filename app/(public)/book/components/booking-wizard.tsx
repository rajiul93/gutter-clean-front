"use client";

import {
  ArrowRight,
  BrushCleaning,
  CalendarDays,
  Check,
  ChevronLeft,
  Droplets,
  Eye,
  Home,
  Loader2,
  Ruler,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";

import { useAuth } from "@/components/providers/auth-provider";
import { useBookingStore } from "@/app/(public)/book/booking-store";
import {
  useAvailability,
  useCreateBooking,
  useMyAddress,
  useUpsertAddress,
} from "@/hooks/api";
import { apiErrorMessage } from "@/lib/axios";
import {
  calculateBookingTotal,
  getService,
  SERVICES,
  SIZE_MULTIPLIER,
  type JobSize,
  type ServiceId,
} from "@/lib/booking-pricing";
import type { SlotPeriod } from "@/lib/booking-slots";
import { cn, formatUsd } from "@/lib/utils";

import { MonthCalendar, toLocalDateISO } from "./month-calendar";

const SERVICE_ICONS: Record<ServiceId, LucideIcon> = {
  gutter: BrushCleaning,
  roof: Home,
  downpipe: Droplets,
  inspect: Eye,
};

const SLOT_META: Record<SlotPeriod, { label: string; range: string; session: string }> = {
  morning: {
    label: "Morning",
    range: "8:00 AM – 12:00 PM",
    session: "Morning session",
  },
  afternoon: {
    label: "Afternoon",
    range: "12:00 PM – 5:00 PM",
    session: "Afternoon session",
  },
  evening: {
    label: "Evening",
    range: "5:00 PM – 8:00 PM",
    session: "Evening session",
  },
};

const SLOTS: SlotPeriod[] = ["morning", "afternoon", "evening"];

const STEPS = [
  { n: 1, title: "Service & options" },
  { n: 2, title: "Date & time" },
  { n: 3, title: "Your details" },
] as const;

function sizeLabel(s: JobSize) {
  if (s === "small") return "Small";
  if (s === "large") return "Large";
  return "Medium";
}

function useSlotAvailability(dateISO: string | null) {
  const { data, isFetching } = useAvailability(dateISO);
  const avail: Record<SlotPeriod, number> = data ?? {
    morning: 3,
    afternoon: 3,
    evening: 3,
  };
  return { avail, pending: isFetching };
}

function Stepper({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol className="mb-6 flex w-full flex-wrap items-center justify-center gap-3 px-1 sm:mb-10 sm:gap-6 md:gap-8">
      {STEPS.map((s) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <li
            key={s.n}
            className="flex min-w-0 max-w-[33%] flex-1 basis-[5.5rem] items-center justify-center gap-1.5 sm:max-w-none sm:flex-none sm:basis-auto sm:justify-start sm:gap-2"
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold sm:size-9 sm:text-sm",
                done && "bg-primary-container text-white",
                active &&
                  !done &&
                  "bg-primary text-white ring-2 ring-primary/30",
                !active &&
                  !done &&
                  "border border-slate-300 bg-white text-slate-400",
              )}
            >
              {done ? <Check className="size-3.5 sm:size-4" /> : s.n}
            </span>
            <span
              className={cn(
                "hidden min-w-0 truncate font-heading text-xs font-semibold sm:inline sm:text-sm",
                active ? "text-primary-container" : "text-slate-500",
              )}
            >
              {s.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function SummaryCard({
  step,
  total,
  subtotalBeforeSize,
  onNext,
  onBack,
  nextDisabled,
}: {
  step: 1 | 2 | 3;
  total: number;
  subtotalBeforeSize: number;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
}) {
  const serviceId = useBookingStore((s) => s.serviceId);
  const featureIds = useBookingStore((s) => s.featureIds);
  const size = useBookingStore((s) => s.size);
  const dateISO = useBookingStore((s) => s.dateISO);
  const slot = useBookingStore((s) => s.slot);

  const svc = serviceId ? getService(serviceId) : null;
  const mult = SIZE_MULTIPLIER[size];

  const scheduledLine = useMemo(() => {
    if (!dateISO || !slot) return null;
    const d = new Date(dateISO + "T12:00:00");
    const day = d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    return `${day} · ${SLOT_META[slot].range}`;
  }, [dateISO, slot]);

  const ctaPrimaryTitle =
    step === 1 ? "Schedule your visit" : "Enter your details";
  const ctaPrimarySub =
    step === 1
      ? "Open the calendar & pick morning, afternoon, or evening."
      : "Name, phone, and email — then we confirm your booking.";
  const ctaPrimarySubShort =
    step === 1
      ? "Pick date & session next."
      : "Contact info on the next screen.";
  const ctaHint = nextDisabled
    ? step === 1
      ? "Select a core service above to unlock this button."
      : "Choose a date on the calendar and tap a time session."
    : "Review your total, then tap below to continue.";

  return (
    <aside className="h-fit rounded-xl border border-slate-200 bg-primary-container p-4 text-white shadow-[var(--shadow-card)] sm:rounded-2xl sm:p-6">
      <h2 className="mb-3 font-heading text-base font-bold sm:mb-4 sm:text-lg">
        Service summary
      </h2>
      <ul className="space-y-2 text-xs text-white/90 sm:space-y-3 sm:text-sm">
        <li className="flex gap-2">
          <Ruler className="mt-0.5 size-4 shrink-0 opacity-80" />
          <span>
            <span className="block text-white/70">Job size</span>
            {sizeLabel(size)} ({mult}×)
          </span>
        </li>
        {svc ? (
          <li className="flex gap-2">
            {(() => {
              const SvcIcon = SERVICE_ICONS[svc.id];
              return <SvcIcon className="mt-0.5 size-4 shrink-0 opacity-80" />;
            })()}
            <span>
              <span className="block text-white/70">Service</span>
              {svc.title}
            </span>
          </li>
        ) : (
          <li className="text-white/60">Pick a service to see details.</li>
        )}
        {svc &&
          featureIds.map((id) => {
            const f = svc.features.find((x) => x.id === id);
            if (!f) return null;
            return (
              <li
                key={id}
                className="flex justify-between gap-2 border-t border-white/10 pt-1.5 text-white/90 sm:pt-2"
              >
                <span className="min-w-0 pr-1 leading-snug">{f.label}</span>
                <span className="shrink-0 tabular-nums">
                  {formatUsd(f.price)}
                </span>
              </li>
            );
          })}
        {scheduledLine && step >= 2 && (
          <li className="flex gap-2 border-t border-white/10 pt-2 sm:pt-3">
            <CalendarDays className="mt-0.5 size-4 shrink-0 opacity-80" />
            <span className="min-w-0">
              <span className="block text-white/70">Scheduled</span>
              <span className="break-words leading-snug">{scheduledLine}</span>
            </span>
          </li>
        )}
      </ul>
      <div className="mt-4 border-t border-white/20 pt-3 sm:mt-6 sm:pt-4">
        <div className="flex items-baseline justify-between gap-2">
          <span className="max-w-[58%] text-xs leading-snug text-white/80 sm:max-w-none sm:text-sm">
            Subtotal (before size)
          </span>
          <span className="shrink-0 text-sm font-medium tabular-nums sm:text-base">
            {formatUsd(subtotalBeforeSize)}
          </span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between gap-2 sm:mt-2">
          <span className="text-xs font-semibold text-white/90 sm:text-sm">
            Total estimate
          </span>
          <span className="font-heading text-xl font-bold tabular-nums sm:text-2xl">
            {formatUsd(total)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2.5 sm:mt-6 sm:gap-3">
        {step < 3 ? (
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <p className="text-center text-[11px] leading-snug text-white/70 sm:text-xs">
              {ctaHint}
            </p>
            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className={cn(
                "group relative flex w-full flex-col items-center gap-0.5 overflow-hidden rounded-xl bg-white px-3 py-2.5 text-primary-container transition sm:gap-1 sm:px-4 sm:py-3.5",
                "hover:brightness-[1.03] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:brightness-100",
                !nextDisabled && "booking-summary-cta--live",
              )}
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-primary-container/75 sm:text-[10px] sm:tracking-[0.12em]">
                Next step
              </span>
              <span className="flex items-center justify-center gap-2 font-heading text-xs font-bold sm:text-sm">
                {ctaPrimaryTitle}
                <ArrowRight
                  className="size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 sm:size-4"
                  aria-hidden
                />
              </span>
              <span className="hidden max-w-[18rem] text-center text-[11px] font-medium leading-tight text-primary-container/85 sm:block">
                {ctaPrimarySub}
              </span>
              <span className="block text-center text-[10px] font-medium leading-tight text-primary-container/85 sm:hidden">
                {ctaPrimarySubShort}
              </span>
            </button>
          </div>
        ) : null}
        {step > 1 ? (
          <button
            type="button"
            onClick={onBack}
            className={cn(
              "flex items-center justify-center gap-1.5 rounded-xl border border-white/25 bg-white/5 py-2 font-heading text-xs font-semibold text-white sm:py-2.5 sm:text-sm",
              "transition hover:border-white/40 hover:bg-white/10",
            )}
          >
            <ChevronLeft className="size-3.5 shrink-0 sm:size-4" aria-hidden />
            <span className="sm:hidden">Back</span>
            <span className="hidden sm:inline">Back to previous step</span>
          </button>
        ) : null}
      </div>
    </aside>
  );
}

export function BookingWizard() {
  const { firebaseUser, profile, loading: authLoading } = useAuth();
  const createBooking = useCreateBooking();
  const upsertAddress = useUpsertAddress();
  const myAddress = useMyAddress();
  const step = useBookingStore((s) => s.step);
  const setStep = useBookingStore((s) => s.setStep);
  const serviceId = useBookingStore((s) => s.serviceId);
  const setService = useBookingStore((s) => s.setService);
  const featureIds = useBookingStore((s) => s.featureIds);
  const toggleFeature = useBookingStore((s) => s.toggleFeature);
  const size = useBookingStore((s) => s.size);
  const setSize = useBookingStore((s) => s.setSize);
  const dateISO = useBookingStore((s) => s.dateISO);
  const setDate = useBookingStore((s) => s.setDate);
  const slot = useBookingStore((s) => s.slot);
  const setSlot = useBookingStore((s) => s.setSlot);
  const name = useBookingStore((s) => s.name);
  const email = useBookingStore((s) => s.email);
  const phone = useBookingStore((s) => s.phone);
  const location = useBookingStore((s) => s.location);
  const setContact = useBookingStore((s) => s.setContact);
  const reset = useBookingStore((s) => s.reset);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Auto-fill name/email from the signed-in user (only when those fields are empty).
  useEffect(() => {
    if (!firebaseUser) return;
    const patch: Parameters<typeof setContact>[0] = {};
    if (!email && firebaseUser.email) patch.email = firebaseUser.email;
    if (!name) {
      const dn = profile?.displayName || firebaseUser.displayName || "";
      if (dn) patch.name = dn;
    }
    if (Object.keys(patch).length > 0) setContact(patch);
  }, [firebaseUser, profile, email, name, setContact]);

  // Auto-fill from the user's saved address (only once on first load when the
  // matching field is still empty — never overwrite ongoing edits).
  const appliedSavedAddrRef = useRef(false);
  useEffect(() => {
    if (appliedSavedAddrRef.current) return;
    if (!firebaseUser) return;
    if (!myAddress.isSuccess) return;
    const saved = myAddress.data;
    if (!saved) {
      appliedSavedAddrRef.current = true;
      return;
    }
    const patch: Parameters<typeof setContact>[0] = {};
    if (!name && saved.name) patch.name = saved.name;
    if (!email && saved.email) patch.email = saved.email;
    if (!phone && saved.phone) patch.phone = saved.phone;
    if (!location && saved.location) patch.location = saved.location;
    if (Object.keys(patch).length > 0) setContact(patch);
    appliedSavedAddrRef.current = true;
  }, [
    firebaseUser,
    myAddress.isSuccess,
    myAddress.data,
    name,
    email,
    phone,
    location,
    setContact,
  ]);

  const { avail, pending } = useSlotAvailability(dateISO);

  const subtotalBeforeSize = useMemo(() => {
    if (!serviceId) return 0;
    const svc = getService(serviceId);
    let sub = svc.basePrice;
    for (const f of svc.features) {
      if (featureIds.includes(f.id)) sub += f.price;
    }
    return sub;
  }, [serviceId, featureIds]);

  const total = useMemo(
    () => calculateBookingTotal(serviceId, featureIds, size),
    [serviceId, featureIds, size],
  );

  const goNext = useCallback(() => {
    if (step === 1 && serviceId) setStep(2);
    else if (step === 2 && dateISO && slot) setStep(3);
  }, [step, serviceId, dateISO, slot, setStep]);

  const goBack = useCallback(() => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  }, [step, setStep]);

  useEffect(() => {
    if (step === 2 && !dateISO) {
      setDate(toLocalDateISO(new Date()));
    }
  }, [step, dateISO, setDate]);

  const step1NextDisabled = !serviceId;
  const step2NextDisabled = !dateISO || !slot;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceId || !dateISO || !slot) return;
    if (authLoading) {
      setFormError("Restoring your session — please wait a moment and try again.");
      return;
    }
    if (!firebaseUser) {
      setFormError("Please sign in to submit your booking.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      // Persist contact + location back to the user's saved address so future
      // bookings auto-fill from these values.
      await upsertAddress.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });
    } catch (err: unknown) {
      setFormError(apiErrorMessage(err, "Could not save your address."));
      setSubmitting(false);
      return;
    }
    try {
      await createBooking.mutateAsync({
        dateISO,
        slot,
        serviceId,
        featureIds,
        size,
        name,
        email,
        phone,
        location,
      });
    } catch (err: unknown) {
      setFormError(apiErrorMessage(err, "Could not submit booking."));
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    setDone(true);
    reset();
  };

  if (done) {
    return (
      <section className="w-full min-w-0 shrink-0 py-8 sm:py-12">
        <div className="mx-auto w-full min-w-[min(100%,18rem)] px-4 sm:min-w-[min(100%,22rem)] md:min-w-[min(100%,28rem)] lg:min-w-[min(100%,36rem)]">
          <div className="w-full rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>

            <h1 className="mb-2 font-heading text-xl sm:text-2xl font-bold text-primary-container">
              Booking received
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-slate-600">
              Thanks — we reserved your time slot. Our team will follow up
              shortly to confirm.
            </p>

            <button
              type="button"
              onClick={() => {
                setDone(false);
                setStep(1);
              }}
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-secondary"
            >
              Book another visit
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="min-w-0">
      <header className="mb-5 text-balance text-center sm:mb-8">
        <h1 className="font-heading text-h2 text-primary-container">
          Book a service
        </h1>
        <p className="mt-1.5 px-1 text-sm leading-relaxed text-slate-600 sm:mt-2 sm:text-base">
          Choose your service, options, and a convenient time.
        </p>
      </header>

      <Stepper step={step} />

      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_minmax(280px,320px)] lg:gap-8 lg:items-start">
        <div className="min-w-0 space-y-5 sm:space-y-6 lg:space-y-8">
          {step === 1 && (
            <>
              <section>
                <h2 className="mb-3 font-heading text-lg font-bold text-primary-container sm:mb-4 sm:text-xl">
                  Select core service
                </h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                  {SERVICES.map((s) => {
                    const Icon = SERVICE_ICONS[s.id];
                    const selected = serviceId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setService(s.id)}
                        className={cn(
                          "relative flex gap-3 rounded-xl border-2 bg-white p-3 text-left shadow-sm transition sm:gap-4 sm:rounded-2xl sm:p-4",
                          selected
                            ? "border-primary-container ring-2 ring-primary/20"
                            : "border-slate-200 hover:border-slate-300",
                        )}
                      >
                        {selected && (
                          <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-primary-container text-white sm:right-3 sm:top-3 sm:size-7">
                            <Check className="size-3.5 sm:size-4" />
                          </span>
                        )}
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-primary-container sm:size-12 sm:rounded-xl">
                          <Icon className="size-5 sm:size-6" />
                        </span>
                        <span className="min-w-0 pr-6 sm:pr-8">
                          <span className="font-heading text-sm font-bold text-slate-900 sm:text-base">
                            {s.title}
                          </span>
                          <span className="mt-0.5 block text-xs leading-snug text-slate-600 sm:mt-1 sm:text-sm">
                            {s.description}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              {serviceId && (
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-2xl sm:p-6">
                  <h3 className="mb-3 font-heading text-base font-bold text-primary-container sm:mb-4 sm:text-lg">
                    {getService(serviceId).title} — add-ons
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {getService(serviceId).features.map((f) => {
                      const on = featureIds.includes(f.id);
                      return (
                        <li key={f.id}>
                          <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5 hover:bg-slate-50 sm:gap-4 sm:rounded-xl sm:px-4 sm:py-3">
                            <span className="flex min-w-0 items-center gap-2 sm:gap-3">
                              <input
                                type="checkbox"
                                checked={on}
                                onChange={() => toggleFeature(f.id)}
                                className="size-4 shrink-0 rounded border-slate-300 text-primary-container"
                              />
                              <span className="text-sm font-medium leading-snug text-slate-800 sm:text-base">
                                {f.label}
                              </span>
                            </span>
                            <span className="shrink-0 text-sm font-semibold tabular-nums text-primary-container">
                              {formatUsd(f.price)}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}

              <section>
                <h3 className="mb-2 font-heading text-base font-bold text-primary-container sm:mb-3 sm:text-lg">
                  Property / job size
                </h3>
                <p className="mb-3 text-xs leading-relaxed text-slate-600 sm:mb-4 sm:text-sm">
                  We price by overall scope (linear feet, roof area, etc.).
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["small", "medium", "large"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={cn(
                        "rounded-lg border-2 px-4 py-2 font-heading text-xs font-semibold transition sm:rounded-xl sm:px-5 sm:py-2.5 sm:text-sm",
                        size === s
                          ? "border-primary-container bg-primary-fixed text-primary-container"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                      )}
                    >
                      {sizeLabel(s)}
                    </button>
                  ))}
                </div>
              </section>

              <div className="lg:hidden">
                <SummaryCard
                  step={1}
                  total={total}
                  subtotalBeforeSize={subtotalBeforeSize}
                  onNext={goNext}
                  onBack={goBack}
                  nextDisabled={step1NextDisabled}
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <section>
                <h2 className="mb-1.5 font-heading text-lg font-bold text-primary-container sm:mb-2 sm:text-2xl">
                  Select a date & time
                </h2>
                <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:mb-6 sm:text-base">
                  Choose a date, then a session. Up to three teams can run per
                  session; when a session is full, it closes.
                </p>

                <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
                  <div className="flex min-w-0 justify-center md:justify-start">
                    <MonthCalendar
                      valueISO={dateISO}
                      onChange={(iso) => {
                        setDate(iso);
                        setSlot(null);
                      }}
                    />
                  </div>

                  <div className="flex min-w-0 flex-col gap-3 md:min-h-[min(500px,70svh)]">
                    {!dateISO && (
                      <p className="text-sm leading-relaxed text-slate-500">
                        Select a date on the calendar to load time sessions.
                      </p>
                    )}
                    {dateISO && (
                      <>
                        <h3 className="font-heading text-base font-bold leading-snug text-primary-container sm:text-lg">
                          Available slots for{" "}
                          {new Date(dateISO + "T12:00:00").toLocaleDateString(
                            undefined,
                            {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </h3>
                        {pending && (
                          <p className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                            <Loader2 className="size-4 shrink-0 animate-spin" />
                            Checking availability…
                          </p>
                        )}
                        <ul className="flex flex-col gap-2 sm:gap-3">
                          {SLOTS.map((period) => {
                            const remaining = avail[period];
                            const meta = SLOT_META[period];
                            const selected = slot === period;
                            const full = remaining <= 0;
                            const limited = remaining === 1;
                            return (
                              <li key={period}>
                                <button
                                  type="button"
                                  disabled={full}
                                  onClick={() => setSlot(period)}
                                  className={cn(
                                    "flex w-full flex-col gap-0.5 rounded-xl border-2 px-3 py-3 text-left transition sm:gap-1 sm:rounded-2xl sm:px-4 sm:py-4",
                                    full &&
                                      "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400",
                                    !full &&
                                      !selected &&
                                      "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50",
                                    selected &&
                                      "border-primary-container bg-primary-container text-white shadow-md",
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="min-w-0 font-heading text-sm font-bold leading-snug sm:text-base">
                                      <span className="block sm:inline">
                                        {meta.range}
                                      </span>
                                      {!selected && !full && (
                                        <span className="mt-0.5 block text-xs font-normal text-slate-500 sm:ml-2 sm:mt-0 sm:inline sm:text-sm">
                                          {meta.label}
                                        </span>
                                      )}
                                      {selected && (
                                        <span className="mt-0.5 block text-xs font-normal text-white/90 sm:ml-2 sm:mt-0 sm:inline sm:text-sm">
                                          {meta.label}
                                        </span>
                                      )}
                                    </span>
                                    {selected && (
                                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 sm:size-8">
                                        <Check className="size-4 sm:size-5" />
                                      </span>
                                    )}
                                  </div>
                                  <span
                                    className={cn(
                                      "text-xs sm:text-sm",
                                      selected
                                        ? "text-white/90"
                                        : "text-slate-600",
                                      full && "text-slate-400",
                                    )}
                                  >
                                    {meta.session}
                                  </span>
                                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:mt-1 sm:gap-2">
                                    {full && (
                                      <span className="text-xs font-bold uppercase tracking-wide text-error">
                                        Not available
                                      </span>
                                    )}
                                    {limited && !full && (
                                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold leading-tight text-amber-900 sm:rounded-md sm:px-2 sm:text-xs">
                                        Limited: 1 spot left
                                      </span>
                                    )}
                                    {!full && remaining === 2 && (
                                      <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
                                        2 spots left
                                      </span>
                                    )}
                                    {!full && remaining >= 3 && (
                                      <span className="text-[10px] font-medium text-slate-500 sm:text-xs">
                                        3 spots left
                                      </span>
                                    )}
                                  </div>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </section>

              <div className="lg:hidden">
                <SummaryCard
                  step={2}
                  total={total}
                  subtotalBeforeSize={subtotalBeforeSize}
                  onNext={goNext}
                  onBack={goBack}
                  nextDisabled={step2NextDisabled}
                />
              </div>
            </>
          )}

          {step === 3 && (
            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)] sm:rounded-2xl sm:p-6">
              <h2 className="mb-1.5 font-heading text-lg font-bold text-primary-container sm:mb-2 sm:text-xl">
                Contact details
              </h2>
              <p className="mb-4 text-xs leading-relaxed text-slate-600 sm:mb-6 sm:text-sm">
                We will confirm by email or phone. Add the job site so our crew
                knows exactly where to go.
              </p>
              {authLoading ? (
                <p className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                  <Loader2 className="size-3.5 shrink-0 animate-spin" />
                  Restoring your session…
                </p>
              ) : !firebaseUser ? (
                <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  <Link
                    href="/login?next=/book"
                    className="font-bold text-primary underline underline-offset-2"
                  >
                    Sign in
                  </Link>{" "}
                  is required to submit a booking so it is saved to your dashboard.
                </p>
              ) : null}
              <form className="space-y-3 sm:space-y-4" onSubmit={onSubmit}>
                <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                  <div className="min-w-0 sm:col-span-1">
                    <label
                      className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm"
                      htmlFor="bk-email"
                    >
                      Email
                    </label>
                    <input
                      id="bk-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setContact({ email: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2 sm:rounded-xl sm:px-4 sm:py-2.5"
                    />
                  </div>
                  <div className="min-w-0 sm:col-span-1">
                    <label
                      className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm"
                      htmlFor="bk-phone"
                    >
                      Phone
                    </label>
                    <input
                      id="bk-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setContact({ phone: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2 sm:rounded-xl sm:px-4 sm:py-2.5"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm"
                    htmlFor="bk-name"
                  >
                    Name
                  </label>
                  <input
                    id="bk-name"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setContact({ name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring-2 sm:rounded-xl sm:px-4 sm:py-2.5"
                  />
                </div>
                <div>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-1.5">
                    <label
                      className="block text-xs font-medium text-slate-700 sm:text-sm"
                      htmlFor="bk-location"
                    >
                      Location
                    </label>
                    {firebaseUser && !authLoading ? (
                      <span className="text-[11px] leading-snug text-slate-500 sm:text-xs">
                        {myAddress.data
                          ? "Pulled from your saved address. Edits here will also update it."
                          : "We&rsquo;ll save this as your default address."}
                      </span>
                    ) : null}
                  </div>
                  <textarea
                    id="bk-location"
                    name="location"
                    required
                    rows={3}
                    autoComplete="street-address"
                    value={location}
                    onChange={(e) => setContact({ location: e.target.value })}
                    placeholder="e.g. 142 Oak Street, Portland, ME 04101 — blue house, side driveway, gate code 4821"
                    className="min-h-[4.5rem] w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm leading-snug outline-none ring-primary/30 placeholder:text-slate-400 focus:ring-2 sm:min-h-[5.25rem] sm:rounded-xl sm:px-4 sm:py-2.5"
                  />
                </div>
                {formError && (
                  <p className="text-sm font-medium text-error">{formError}</p>
                )}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-container px-6 py-3 font-heading text-sm font-bold text-white hover:brightness-110 disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="size-4 animate-spin" />}
                    Submit booking
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="font-heading text-sm font-semibold text-primary hover:underline"
                  >
                    ← Back
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>

        <div className="hidden lg:block">
          <SummaryCard
            step={step}
            total={total}
            subtotalBeforeSize={subtotalBeforeSize}
            onNext={goNext}
            onBack={goBack}
            nextDisabled={
              step === 1
                ? step1NextDisabled
                : step === 2
                  ? step2NextDisabled
                  : true
            }
          />
        </div>
      </div>

      {/* Mobile: step 3 has its own actions; show compact summary */}
      {step === 3 && (
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:mt-8 sm:rounded-2xl sm:p-4 lg:hidden">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-semibold text-slate-700 sm:text-sm">
              Total estimate
            </span>
            <span className="font-heading text-lg font-bold tabular-nums text-primary-container sm:text-xl">
              {formatUsd(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
