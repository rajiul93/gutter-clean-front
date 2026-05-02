"use client";

import { submitContact, type ContactFormState } from "@/app/(public)/contact/actions";
import { cn } from "@/lib/utils";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

const initialState: ContactFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "rounded-2xl bg-primary px-xl py-md font-heading text-label-sm text-white transition-all",
        "hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60",
      )}
    >
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);

  return (
    <form
      action={formAction}
      className="not-prose space-y-md rounded-2xl border border-slate-200 bg-white p-md shadow-card sm:p-lg"
    >
      <div>
        <label
          htmlFor="contact-email"
          className="mb-xs block font-heading text-sm font-semibold text-primary"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm font-body text-body-md text-on-background outline-none ring-primary/30 transition-shadow focus:border-primary focus:ring-2"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="contact-title"
          className="mb-xs block font-heading text-sm font-semibold text-primary"
        >
          Title
        </label>
        <input
          id="contact-title"
          name="title"
          type="text"
          required
          maxLength={200}
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm font-body text-body-md text-on-background outline-none ring-primary/30 transition-shadow focus:border-primary focus:ring-2"
          placeholder="What is this about?"
        />
      </div>
      <div>
        <label
          htmlFor="contact-description"
          className="mb-xs block font-heading text-sm font-semibold text-primary"
        >
          Description
        </label>
        <textarea
          id="contact-description"
          name="description"
          required
          rows={5}
          maxLength={5000}
          className="w-full resize-y rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm font-body text-body-md text-on-background outline-none ring-primary/30 transition-shadow focus:border-primary focus:ring-2"
          placeholder="Tell us more about your property or request…"
        />
      </div>
      {state.error ? (
        <p className="font-body text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="font-body text-sm font-medium text-primary" role="status">
          Thanks—we received your message and will reply soon.
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
