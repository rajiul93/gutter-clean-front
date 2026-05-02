"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

export type ShellNavItem = {
  href: string;
  label: string;
  comingSoon?: boolean;
};

type DashboardShellProps = {
  title: string;
  navItems: ShellNavItem[];
  children: ReactNode;
};

export function DashboardShell({ title, navItems, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, firebaseUser, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const userEmail = profile?.email ?? firebaseUser?.email ?? null;
  const userName = profile?.displayName ?? firebaseUser?.displayName ?? userEmail;

  async function onLogout() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
      router.replace("/login");
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-0px)] bg-surface">
      <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="sticky top-0 flex h-full min-h-screen flex-col px-4 py-6">
          <Link href="/" className="mb-8 flex items-center gap-2 px-2">
            <Image
              src="/gutter-logo.png"
              alt="GutterPrecision"
              width={180}
              height={48}
              className="h-10 w-auto"
            />
          </Link>
          <p className="mb-3 px-2 font-heading text-label-sm font-bold uppercase tracking-wide text-slate-400">
            {title}
          </p>
          <nav className="flex flex-1 flex-col gap-1">
            {navItems.map((item) => {
              const active =
                item.href.startsWith("#") ? false : pathname === item.href.split("#")[0];
              if (item.comingSoon) {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => alert("Coming soon")}
                    className="rounded-xl px-3 py-2.5 text-left font-heading text-sm font-semibold text-slate-400 transition-colors hover:bg-slate-50"
                  >
                    {item.label}
                    <span className="mt-0.5 block text-[10px] font-normal uppercase tracking-wide text-slate-400">
                      Coming soon
                    </span>
                  </button>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-2.5 font-heading text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-slate-100 pt-4">
            {userEmail ? (
              <div className="mb-3 px-2">
                <p className="truncate font-heading text-sm font-semibold text-slate-800" title={userName ?? undefined}>
                  {userName}
                </p>
                <p className="truncate text-xs text-slate-500" title={userEmail}>
                  {userEmail}
                </p>
              </div>
            ) : null}
            <Link
              href="/"
              className="block rounded-xl px-3 py-2 font-heading text-sm font-semibold text-slate-500 hover:text-primary"
            >
              ← Back to site
            </Link>
            <button
              type="button"
              onClick={onLogout}
              disabled={signingOut}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 font-heading text-sm font-semibold text-error transition-colors hover:bg-red-50 disabled:opacity-60"
            >
              <LogOut className="size-4" aria-hidden />
              {signingOut ? "Signing out…" : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <p className="font-heading text-sm font-bold text-primary">{title}</p>
          <button
            type="button"
            onClick={onLogout}
            disabled={signingOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-error hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut className="size-3.5" aria-hidden />
            {signingOut ? "…" : "Logout"}
          </button>
        </div>
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-10">{children}</div>
      </div>
    </div>
  );
}
