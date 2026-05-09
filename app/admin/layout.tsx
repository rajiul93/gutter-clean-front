"use client";

import { DashboardShell, type ShellNavItem } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

const nav: ShellNavItem[] = [
  { href: "/admin", label: "Online bookings" },
  { href: "/admin/call", label: "Phone Call bookings" },
  { href: "/admin/hero-leads", label: "Hero quote requests" },
  { href: "#", label: "Customers", comingSoon: true },
  { href: "#", label: "Reports", comingSoon: true },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { firebaseUser, profile, loading, profileLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      router.replace("/login?next=/admin");
      return;
    }
    if (profileLoading) return;
    if (!profile) {
      router.replace("/login?next=/admin");
      return;
    }
    if (profile.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [firebaseUser, profile, loading, profileLoading, router]);

  if (loading || !firebaseUser || profileLoading || !profile || profile.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface font-body text-slate-600">
        Loading…
      </div>
    );
  }

  return (
    <DashboardShell title="Admin" navItems={nav}>
      {children}
    </DashboardShell>
  );
}
