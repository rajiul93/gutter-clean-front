import { cn } from "@/lib/utils";
import { Globe, Mail } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/service-areas", label: "Service Areas" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-slate-100 bg-white py-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between px-6 md:flex-row">
        <div className="mb-lg md:mb-0">
          <Link
            href="/"
            className="text-md block font-bold uppercase text-primary"
          >
            GutterPrecision
          </Link>
          <p className="mt-2 font-heading text-xs text-slate-500">
            © {new Date().getFullYear()} GutterPrecision. Professional Home
            Maintenance.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:gap-x-8">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-heading text-xs text-slate-400 transition-opacity hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="mt-lg flex space-x-md md:mt-0">
          <Link
            href="/service-areas"
            className={cn(
              "flex size-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 transition-all hover:text-primary",
            )}
            aria-label="Service areas"
          >
            <Globe className="size-4" strokeWidth={2} aria-hidden />
          </Link>
          <Link
            href="/contact"
            className={cn(
              "flex size-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400 transition-all hover:text-primary",
            )}
            aria-label="Contact"
          >
            <Mail className="size-4" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
    </footer>
  );
}
