"use client";

import { submitHeroLead, type HeroLeadFormState } from "@/home/actions";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialState: HeroLeadFormState = {};

const inputClass = cn(
  "w-full rounded-xl border border-white/25 bg-white/85 px-3 py-2 font-body text-sm text-slate-900 shadow-sm outline-none backdrop-blur-sm",
  "placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
);

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full rounded-xl bg-primary px-md py-2.5 font-heading text-label-sm font-bold text-white shadow-md transition-all",
        "hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {pending ? "Sending…" : "Send"}
    </button>
  );
}

export function HeroLeadForm() {
  const [state, formAction] = useActionState(submitHeroLead, initialState);

  if (state.success) {
    return (
      <div
        className="w-full min-w-0 rounded-2xl border border-white/25 bg-white/10 p-md text-white shadow-lg backdrop-blur-md"
        role="status"
      >
        <p className="font-heading text-sm font-bold">Thanks — we’ll be in touch soon.</p>
        <p className="mt-1 text-xs text-white/85">Your details were received.</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="w-full min-w-0 rounded-2xl border border-white/20 bg-white/10 p-md shadow-lg backdrop-blur-md sm:p-lg"
    >
      <p className="mb-3 font-heading text-sm font-bold text-white drop-shadow-sm sm:text-base">
        Request a quote
      </p>
      <div className="space-y-2.5">
        <div>
          <label htmlFor="hero-lead-name" className="sr-only">
            Name
          </label>
          <input
            id="hero-lead-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={200}
            className={inputClass}
            placeholder="Name"
          />
        </div>
        <div>
          <label htmlFor="hero-lead-location" className="sr-only">
            Location
          </label>
          <textarea
            id="hero-lead-location"
            name="location"
            required
            rows={2}
            maxLength={2000}
            className={cn(inputClass, "min-h-16 max-h-28 resize-y overflow-y-auto")}
            placeholder="Location"
          />
        </div>
        <div>
          <label htmlFor="hero-lead-phone" className="sr-only">
            Phone
          </label>
          <input
            id="hero-lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            className={inputClass}
            placeholder="Phone"
          />
        </div>
      </div>
      {state.error ? (
        <p className="mt-2 text-xs font-medium text-amber-200" role="alert">
          {state.error}
        </p>
      ) : null}
      <div className="mt-3">
        <SendButton />
      </div>
    </form>
  );
}
