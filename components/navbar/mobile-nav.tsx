"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type NavLinkItem = {
  readonly href: string;
  readonly label: string;
};

type MobileNavProps = {
  pathname: string;
  links: readonly NavLinkItem[];
  /** Admin link when role is ADMIN */
  showAdmin: boolean;
  loading: boolean;
  firebaseUser: unknown;
};

function useClientMounted() {
  return useSyncExternalStore(
    () => () => {
      /* no external store */
    },
    () => true,
    () => false,
  );
}

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function MenuTrigger({
  open,
  onClick,
  id,
  controlsId,
}: {
  open: boolean;
  onClick: () => void;
  id: string;
  controlsId: string;
}) {
  return (
    <button
      type="button"
      id={id}
      aria-expanded={open}
      aria-controls={controlsId}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      onClick={onClick}
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white shadow-sm outline-none transition-[box-shadow,transform] duration-200 ease-out hover:border-primary/25 hover:shadow-md active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
        open && "border-primary/30 shadow-md",
      )}
    >
      <span className="sr-only">Menu</span>
      <span className="flex h-[18px] w-[22px] flex-col justify-center gap-[5px]">
        <span
          className={cn(
            "block h-0.5 w-full origin-center rounded-full bg-primary transition-all duration-300 ease-in-out",
            open && "translate-y-[7px] rotate-45",
          )}
          aria-hidden
        />
        <span
          className={cn(
            "block h-0.5 w-full rounded-full bg-primary transition-all duration-200 ease-out",
            open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100",
          )}
          aria-hidden
        />
        <span
          className={cn(
            "block h-0.5 w-full origin-center rounded-full bg-primary transition-all duration-300 ease-in-out",
            open && "translate-y-[-7px] -rotate-45",
          )}
          aria-hidden
        />
      </span>
    </button>
  );
}

export function MobileNav({
  pathname,
  links,
  showAdmin,
  loading,
  firebaseUser,
}: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const mounted = useClientMounted();
  const instanceId = useId();
  const triggerId = `mobile-nav-trigger-${instanceId}`;
  const panelId = `mobile-nav-panel-${instanceId}`;

  useBodyScrollLock(open && mounted);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  const linkActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const panel = mounted ? (
    <div
      className={cn(
        "md:hidden",
        !open && "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/45 backdrop-blur-[2px] transition-[opacity,visibility] duration-300 ease-out",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden
        onClick={close}
      />
      <div
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={triggerId}
        inert={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-48 flex h-dvh min-h-0 w-[min(100%,20rem)] flex-col border-l border-slate-100 bg-white shadow-[-12px_0_40px_rgb(30,58,138,0.08)]",
          "pt-19 sm:pt-22",
          "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <span className="font-heading text-sm font-bold text-primary">Menu</span>
          <button
            type="button"
            onClick={close}
            className="rounded-lg px-2 py-1 font-body text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-primary"
          >
            Close
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-3 py-4" aria-label="Mobile">
          {links.map((link) => {
            const active = linkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={cn(
                  "rounded-xl px-3 py-3 font-heading text-base font-semibold tracking-tight transition-colors",
                  active
                    ? "bg-secondary-container/15 text-primary"
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 px-4 py-4">
          {loading ? (
            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" aria-hidden />
          ) : (
            <div className="flex flex-col gap-1">
              {showAdmin ? (
                <Link
                  href="/admin"
                  onClick={close}
                  className="rounded-xl px-3 py-2.5 font-heading text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary"
                >
                  Admin
                </Link>
              ) : null}
              {firebaseUser ? (
                <Link
                  href="/dashboard"
                  onClick={close}
                  className="rounded-xl px-3 py-2.5 font-heading text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={close}
                  className="rounded-xl px-3 py-2.5 font-heading text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-primary"
                >
                  Login
                </Link>
              )}
            </div>
          )}

          <Link
            href="/book"
            onClick={close}
            className={cn(
              "mt-4 flex w-full items-center justify-center rounded-2xl bg-primary py-3.5 font-heading text-label-sm font-bold text-white shadow-md shadow-primary/15",
              "transition-[background-color,box-shadow] duration-200 hover:bg-primary/95",
            )}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <MenuTrigger
        id={triggerId}
        open={open}
        onClick={() => setOpen((o) => !o)}
        controlsId={panelId}
      />
      {mounted && panel ? createPortal(panel, document.body) : null}
    </>
  );
}
