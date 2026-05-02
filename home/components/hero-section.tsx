import { cn, siteContentClass } from "@/lib/utils";
import { ArrowRight, BadgeCheck, CalendarPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAi7gP56dXyClymUBoyJIIEe3S5-eQlT2H0oBZzb-SK6btFidIknkeyWA_OQ-P0FYuQiblDEHJcdkwRqG5l6ueQB96wvqSIeThjY6ZquMc96CrsufA-m5SAsfSw2cbUkYTRJsIHMzz4Kqf7UFrTarU7SLHxmv04u83iBPgy-J6BKmRLgX9SOGSCmzvY7n7MC7_PrwIP94Wp3tZLnCE56fBm0FJbOmR3vJ5l6XGbMk-SLncmPg9Ona5LSIjjA3KX4ZmvHI_Bo1p-DwJm";

export function HeroSection() {
  return (
    <section className="bg-background pb-huge pt-lg">
      <div className={cn(siteContentClass, "grid items-center gap-xl lg:grid-cols-2")}>
        <div className="space-y-lg">
          <div
            className={cn(
              "hero-enter hero-enter-delay-1 inline-flex items-center space-x-sm rounded-full bg-secondary-container/10 px-md py-xs",
              "transition-shadow duration-300 hover:shadow-md hover:shadow-primary/5",
            )}
          >
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
              Premium Care for Your Home
            </span>
          </div>
          <h1
            className={cn(
              "hero-enter hero-enter-delay-2 text-balance font-heading text-h1 text-primary",
            )}
          >
            Flawless Infrastructure. <br />
            Precision Maintenance.
          </h1>
          <p
            className={cn(
              "hero-enter hero-enter-delay-3 text-pretty font-body text-body-lg text-on-surface-variant",
            )}
          >
            Gutter cleaning, roof care, flushing, and inspections—book online or
            message us for a clear quote and documented results you can trust.
          </p>
          <div className="hero-enter hero-enter-delay-4 flex flex-col gap-md pt-md sm:flex-row">
            <Link
              href="/book"
              className={cn(
                "group inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-xl py-md text-center font-heading text-label-sm text-white shadow-lg shadow-primary/20",
                "transition-all duration-300 ease-out",
                "hover:bg-secondary hover:shadow-xl hover:shadow-primary/25 motion-safe:hover:-translate-y-0.5",
                "active:scale-[0.98]",
              )}
            >
              <CalendarPlus className="size-4 shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden />
              <span>Book a service</span>
              <ArrowRight
                className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
                aria-hidden
              />
            </Link>
            <Link
              href="/about"
              className={cn(
                "inline-flex items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low px-xl py-md text-center font-heading text-label-sm text-primary",
                "transition-all duration-300 ease-out",
                "hover:border-primary/30 hover:bg-surface-container-high motion-safe:hover:-translate-y-0.5",
                "active:scale-[0.98]",
              )}
            >
              About us
            </Link>
          </div>
          <div className="hero-enter hero-enter-delay-5 flex items-center space-x-xl border-t border-slate-100 pt-lg">
            {[
              { value: "12k+", label: "Homes Serviced" },
              { value: "4.9/5", label: "Trust Rating" },
              { value: "100%", label: "Guarantee" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="transition-transform duration-300 ease-out motion-safe:hover:-translate-y-0.5"
              >
                <div className="font-heading text-h3 text-primary">{stat.value}</div>
                <div className="text-xs uppercase tracking-tighter text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative hero-enter hero-enter-delay-4">
          <div
            className={cn(
              "group hero-image-reveal aspect-square overflow-hidden rounded-2xl shadow-2xl",
              "ring-1 ring-black/5 transition-transform duration-700 ease-out motion-safe:hover:scale-[1.02]",
            )}
          >
            <Image
              src={HERO_IMAGE}
              alt="Modern house exterior with clean architecture and maintained roof and gutters"
              width={800}
              height={800}
              className="size-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]"
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div className="hero-card-enter absolute -bottom-md -left-md">
            <div
              className={cn(
                "hero-badge-soft-float flex items-center space-x-md rounded-2xl bg-white p-lg shadow-xl",
                "ring-1 ring-slate-100 transition-shadow duration-300 hover:shadow-2xl",
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-full bg-secondary-container text-primary transition-transform duration-300 hover:scale-105">
                <BadgeCheck
                  className="size-6 shrink-0"
                  strokeWidth={2}
                  aria-hidden
                />
              </div>
              <div>
                <p className="font-heading text-sm text-primary">Certified Pros</p>
                <p className="text-xs text-slate-500">Fully insured & bonded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
