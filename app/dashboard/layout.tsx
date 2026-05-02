"use client";

import { DashboardShell, type ShellNavItem } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const nav: ShellNavItem[] = [
  { href: "/dashboard", label: "Overview" },
  { href: "#", label: "Messages", comingSoon: true },
  { href: "#", label: "Billing", comingSoon: true },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace("/login?next=/dashboard");
    }
  }, [firebaseUser, loading, router]);

  if (loading || !firebaseUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface font-body text-slate-600">
        Loading…
      </div>
    );
  }

  return (
    <DashboardShell title="My account" navItems={nav}>
      {children}
    </DashboardShell>
  );
}
