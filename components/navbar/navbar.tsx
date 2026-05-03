"use client";

import { MobileNav } from "@/components/navbar/mobile-nav";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/review", label: "Reviews" },
  { href: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { firebaseUser, profile, loading } = useAuth();

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b border-slate-100",
        "bg-white/90 shadow-[0_8px_30px_rgb(30,58,138,0.04)] backdrop-blur-md",
      )}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="relative flex shrink-0 items-center overflow-hidden rounded-lg outline-offset-4"
        >
          <Image
            src="/gutter-logo.png"
            alt="GutterPrecision"
            width={300}
            height={80}
            className="h-11 w-auto sm:h-14"
            priority
          />
        </Link>
        <div className="hidden items-center space-x-xl md:flex">
          {links.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-heading text-sm font-semibold tracking-tight transition-colors",
                  active
                    ? "border-b-2 border-primary pb-1 text-primary"
                    : "text-slate-500 hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="hidden items-center space-x-md md:flex">
          {profile?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="font-heading text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
            >
              Admin
            </Link>
          ) : null}
          {loading ? (
            <span
              aria-hidden
              className="h-5 w-16 animate-pulse rounded-md bg-slate-100"
            />
          ) : firebaseUser ? (
            <Link
              href="/dashboard"
              className="font-heading text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="font-heading text-sm font-semibold text-slate-600 transition-colors hover:text-primary"
            >
              Login
            </Link>
          )}
          <Link
            href="/book"
            className={cn(
              "rounded-2xl bg-primary px-xl py-md text-center font-heading text-label-sm text-white transition-colors duration-200",
              "hover:bg-secondary",
            )}
          >
            Book Now
          </Link>
        </div>

        <div className="flex shrink-0 md:hidden">
          <MobileNav
            key={pathname}
            pathname={pathname}
            links={links}
            showAdmin={profile?.role === "ADMIN"}
            loading={loading}
            firebaseUser={firebaseUser}
          />
        </div>
      </nav>
    </header>
  );
}
