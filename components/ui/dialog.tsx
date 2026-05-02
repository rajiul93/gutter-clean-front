"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Tailwind max-w utility, e.g. "max-w-lg" */
  size?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  size = "sm:max-w-2xl",
}: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      aria-modal="true"
      role="dialog"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={() => onOpenChange(false)}
        className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-sm"
      />
      <div
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl",
          size,
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-heading text-lg font-bold text-primary-container">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-600">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="-mr-2 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export function DialogFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6 flex flex-wrap items-center justify-end gap-2", className)}>
      {children}
    </div>
  );
}
