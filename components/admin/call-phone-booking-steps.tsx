"use client";

import { MonthCalendar } from "@/app/(public)/book/components/month-calendar";
import { useAvailability } from "@/hooks/api";
import type { SlotPeriod } from "@/lib/booking-slots";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  CallBookingContactFields,
  CallBookingStepPickService,
  type CallBookingFormValues,
} from "./call-booking-form";

const STEP_LABELS = [
  { n: 1 as const, title: "Service" },
  { n: 2 as const, title: "Date & time" },
  { n: 3 as const, title: "Caller details" },
];

const SESSION_META: Record<
  SlotPeriod,
  { label: string; range: string }
> = {
  morning: { label: "Morning", range: "8:00 AM – 12:00 PM" },
  afternoon: { label: "Afternoon", range: "12:00 PM – 5:00 PM" },
  evening: { label: "Evening", range: "5:00 PM – 8:00 PM" },
};

const SESSIONS: SlotPeriod[] = ["morning", "afternoon", "evening"];

function PhoneStepDots({ step }: { step: 1 | 2 | 3 }) {
  return (
    <ol className="mb-6 flex flex-wrap items-center gap-3 px-1 sm:mb-8 sm:gap-5">
      {STEP_LABELS.map((s) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <li key={s.n} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold sm:size-9 sm:text-sm",
                done && "bg-primary text-white",
                active && !done && "bg-primary-container text-white ring-2 ring-primary/25",
                !active && !done && "border border-slate-300 bg-white text-slate-400",
              )}
            >
              {done ? <Check className="size-3.5 sm:size-4" /> : s.n}
            </span>
            <span
              className={cn(
                "hidden font-heading text-xs font-semibold sm:inline sm:text-sm",
                active ? "text-primary" : "text-slate-500",
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

function useSessionAvailability(dateISO: string | null) {
  const { data, isFetching } = useAvailability(dateISO?.trim() || null);
  const avail: Record<SlotPeriod, number> = data ?? {
    morning: 3,
    afternoon: 3,
    evening: 3,
  };
  return { avail, pending: isFetching };
}

function StepDateAndSessions({
  values,
  patchValues,
}: {
  values: CallBookingFormValues;
  patchValues: (p: Partial<CallBookingFormValues>) => void;
}) {
  const dateISO = values.preferredDateISO.trim() || null;
  const { avail, pending } = useSessionAvailability(dateISO);

  const headline = useMemo(() => {
    if (!dateISO) return "";
    try {
      return new Date(`${dateISO}T12:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateISO;
    }
  }, [dateISO]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-heading text-lg font-bold text-primary sm:text-xl">Date & session</h2>
        <p className="mt-1 text-sm text-slate-600">
          Same steps as web booking: choose the day first, then a time window (or flexible if the caller
          is open all day).
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8">
        <div className="flex min-w-0 justify-center md:justify-start">
          <MonthCalendar
            valueISO={values.preferredDateISO.trim() || null}
            onChange={(iso) =>
              patchValues({
                preferredDateISO: iso,
                preferredSlot: "",
              })
            }
          />
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {!dateISO ? (
            <p className="text-sm leading-relaxed text-slate-500">
              Select a date on the calendar — then lock morning, afternoon, evening, or mark the day as
              flexible.
            </p>
          ) : (
            <>
              <h3 className="font-heading text-base font-bold text-primary sm:text-lg">
                Preferred visit — {headline}
              </h3>

              <button
                type="button"
                onClick={() => patchValues({ preferredSlot: "flexible" })}
                className={cn(
                  "rounded-xl border-2 px-4 py-3 text-left transition sm:rounded-2xl sm:px-5 sm:py-4",
                  values.preferredSlot === "flexible"
                    ? "border-primary-container bg-primary-container text-white shadow-md"
                    : "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50",
                )}
              >
                <span className="block font-heading text-sm font-bold">Flexible anytime that day</span>
                <span
                  className={cn(
                    "mt-0.5 block text-xs leading-relaxed sm:text-sm",
                    values.preferredSlot === "flexible" ? "text-white/85" : "text-slate-600",
                  )}
                >
                  Customer is okay with any crew arrival window we assign on{" "}
                  <span className="font-semibold">{headline}</span>.
                </span>
              </button>

              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fixed session (shows live capacity — same rule as web)
              </p>

              {pending ? (
                <p className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
                  <Loader2 className="size-4 shrink-0 animate-spin" />
                  Checking availability…
                </p>
              ) : null}

              <ul className="flex flex-col gap-2 sm:gap-3">
                {SESSIONS.map((period) => {
                  const meta = SESSION_META[period];
                  const remaining = avail[period];
                  const full = remaining <= 0;
                  const limited = remaining === 1;
                  const selected = values.preferredSlot === period;

                  return (
                    <li key={period}>
                      <button
                        type="button"
                        disabled={full}
                        onClick={() => patchValues({ preferredSlot: period })}
                        className={cn(
                          "flex w-full flex-col gap-0.5 rounded-xl border-2 px-3 py-3 text-left transition sm:rounded-2xl sm:px-4 sm:py-4",
                          full &&
                            "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-400",
                          !full &&
                            !selected &&
                            "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50",
                          selected &&
                            full === false &&
                            "border-primary-container bg-primary-container text-white shadow-md",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="min-w-0 font-heading text-sm font-bold sm:text-base">
                            <span className="block sm:inline">{meta.range}</span>
                            <span
                              className={cn(
                                "mt-0.5 block text-xs font-normal sm:ml-2 sm:mt-0 sm:inline sm:text-sm",
                                selected ? "text-white/85" : "text-slate-500",
                              )}
                            >
                              {meta.label}
                            </span>
                          </span>
                          {selected && !full ? (
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 sm:size-8">
                              <Check className="size-4 sm:size-5" />
                            </span>
                          ) : null}
                        </div>
                        <span
                          className={cn(
                            "text-xs sm:text-sm",
                            selected ? "text-white/90" : "text-slate-600",
                            full && "text-slate-400",
                          )}
                        >
                          {period === "morning"
                            ? "Morning crew window"
                            : period === "afternoon"
                              ? "Afternoon crew window"
                              : "Evening crew window"}
                        </span>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {full ? (
                            <span className="text-xs font-bold uppercase tracking-wide text-error">
                              Session full (web parity)
                            </span>
                          ) : null}
                          {limited && !full ? (
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900">
                              1 spot left
                            </span>
                          ) : null}
                          {!full && remaining === 2 ? (
                            <span className="text-[11px] text-slate-500">2 spots left</span>
                          ) : null}
                          {!full && remaining >= 3 ? (
                            <span className="text-[11px] text-slate-500">3 spots left</span>
                          ) : null}
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
    </div>
  );
}

export type PhoneCallBookingWizardProps = {
  step: 1 | 2 | 3;
  onStepChange: (step: 1 | 2 | 3) => void;
  values: CallBookingFormValues;
  patchValues: (patch: Partial<CallBookingFormValues>) => void;
  /** Step 3 contact fields emit a full merged object (phone edits clear repeat-caller linkage in parent). */
  replaceValues: (next: CallBookingFormValues) => void;
  idPrefix: string;
  banner?: ReactNode;
  phoneExtra?: ReactNode;
};

/**
 * Guided 3-step flow for admins taking bookings over the phone — mirrors `/book`
 * progression (service → calendar & session → caller details).
 */
export function PhoneCallBookingWizard({
  step,
  onStepChange,
  values,
  patchValues,
  replaceValues,
  idPrefix,
  banner,
  phoneExtra,
}: PhoneCallBookingWizardProps) {
  const scheduleReady = values.preferredDateISO.trim().length > 0 && values.preferredSlot !== "";

  function goBack() {
    if (step === 3) onStepChange(2);
    else if (step === 2) onStepChange(1);
  }

  function goNext() {
    if (step === 1) onStepChange(2);
    else if (step === 2 && scheduleReady) onStepChange(3);
  }

  const backDisabled = step === 1;
  const nextDisabled = step === 2 && !scheduleReady;

  return (
    <div className="space-y-4">
      {banner != null ? (
        <div className="rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-950">
          {banner}
        </div>
      ) : null}
      <PhoneStepDots step={step} />

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
        {step === 1 ? (
          <CallBookingStepPickService
            serviceId={values.serviceId}
            onSelect={(serviceId) => patchValues({ serviceId })}
          />
        ) : null}

        {step === 2 ? <StepDateAndSessions values={values} patchValues={patchValues} /> : null}

        {step === 3 ? (
          <div className="space-y-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-primary sm:text-xl">
                Caller & job site
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Name, callback number (look up repeats), and where the crew should go.
              </p>
            </div>
            <CallBookingContactFields
              idPrefix={idPrefix}
              values={values}
              phoneExtra={phoneExtra}
              onChange={replaceValues}
            />
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            disabled={backDisabled}
            onClick={() => goBack()}
            className={cn(
              "rounded-xl px-5 py-2.5 font-heading text-sm font-bold text-primary transition hover:bg-primary/10 disabled:opacity-40",
            )}
          >
            Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              disabled={nextDisabled}
              onClick={() => goNext()}
              className="rounded-xl bg-primary px-5 py-2.5 font-heading text-sm font-bold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next step
            </button>
          ) : (
            <p className="text-xs font-medium text-slate-500 sm:text-sm">
              Use Save below once details are confirmed on the phone.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
