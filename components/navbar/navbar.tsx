"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
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
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="relative rounded-lg overflow-hidden flex shrink-0 items-center outline-offset-4 "
        >
          <Image
            src="/gutter-logo.png"
            alt="GutterPrecision"
            width={300}
            height={80}
            className="h-14 w-auto"
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
        <div className="flex items-center space-x-md">
          {profile?.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="font-heading text-sm font-semibold text-slate-600 transition-all hover:text-primary"
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
              className="font-heading text-sm font-semibold text-slate-600 transition-all hover:text-primary"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="font-heading text-sm font-semibold text-slate-600 transition-all hover:text-primary"
            >
              Login
            </Link>
          )}
          <Link
            href="/book"
            className={cn(
              "rounded-2xl bg-primary px-xl py-md text-center font-heading text-label-sm text-white transition-all duration-200",
              "hover:bg-secondary active:scale-95",
            )}
          >
            Book Now
          </Link>
        </div>
      </nav>
    </header>
  );
}
