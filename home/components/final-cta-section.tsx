import { cn, siteContentClass } from "@/lib/utils";
import Link from "next/link";
import type { CSSProperties } from "react";

const fontHeading =
  "var(--font-manrope), ui-sans-serif, system-ui, sans-serif";
const fontBody =
  "var(--font-work-sans), ui-sans-serif, system-ui, sans-serif";

const type: Record<string, CSSProperties> = {
  h2: {
    fontFamily: fontHeading,
    fontSize: "clamp(1.5rem, 1rem + 2.4vw, 2.25rem)",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    fontWeight: 700,
    color: "#ffffff",
  },
  lead: {
    fontFamily: fontBody,
    fontSize: "clamp(0.95rem, 0.85rem + 0.45vw, 1.125rem)",
    lineHeight: 1.65,
    fontWeight: 400,
    color: "rgba(255, 255, 255, 0.92)",
    maxWidth: "min(36rem, 100%)",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  },
  button: {
    fontFamily: fontHeading,
    fontSize: "clamp(0.78rem, 0.72rem + 0.2vw, 0.875rem)",
    lineHeight: 1.2,
    fontWeight: 600,
  },
  footnote: {
    fontFamily: fontBody,
    fontSize: "clamp(0.625rem, 0.58rem + 0.2vw, 0.75rem)",
    lineHeight: 1.3,
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255, 255, 255, 0.5)",
  },
};

export function FinalCtaSection() {
  return (
    <section className="py-huge">
      <div className={siteContentClass}>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-huge text-center text-white">
        <div className="absolute right-0 top-0 size-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 size-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-secondary-container/10" />
        <div className="relative z-10 space-y-lg">
          <h2 style={type.h2}>Ready for a Precision Clean?</h2>
          <p style={type.lead}>
            Book your first service today and experience the future of home
            maintenance. 100% satisfaction guaranteed.
          </p>
          <div className="flex flex-col justify-center gap-md sm:flex-row">
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center rounded-2xl bg-white px-huge py-md text-primary shadow-xl transition-all",
                "hover:bg-secondary-container",
              )}
              style={{ ...type.button, color: "var(--color-primary)" }}
            >
              Get a quote
            </Link>
            <a
              href="tel:+15555550100"
              className={cn(
                "inline-flex items-center justify-center rounded-2xl border border-white/20 bg-primary-container px-huge py-md text-white transition-all",
                "hover:bg-white/10",
              )}
              style={type.button}
            >
              Call us
            </a>
          </div>
          <p className="pt-md" style={type.footnote}>
            Trusted by 12,000+ happy homeowners
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
