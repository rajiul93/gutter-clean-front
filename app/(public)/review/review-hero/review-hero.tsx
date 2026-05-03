import { cn, siteContentClass } from "@/lib/utils";
import { Award, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

const trustItems = [
  {
    label: "Google Certified Professional",
    icon: ShieldCheck,
  },
  {
    label: "Top Rated on Yelp 2024",
    icon: Star,
  },
  {
    label: "Angi Super Service Award",
    icon: Award,
  },
];

export function ReviewHero() {
  return (
    <section className="overflow-x-clip border-b border-outline-variant/40 bg-background pb-0 pt-lg sm:pt-xl md:pt-xxl">
      <div
        className={cn(
          siteContentClass,
          "flex flex-col items-center pb-lg text-center sm:pb-xl md:pb-xxl",
        )}
      >
        <div
          className={cn(
            "inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-secondary-fixed-dim/60 bg-secondary-fixed/30 px-3 py-2 sm:max-w-88 sm:px-md sm:py-sm",
            "font-heading text-xs font-semibold text-primary sm:text-body-sm md:text-sm",
          )}
          aria-label="Average customer rating 4.9 out of 5"
        >
          <span className="flex shrink-0 items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={String(i)}
                className="size-3 shrink-0 fill-secondary text-secondary sm:size-[15px]"
                aria-hidden
              />
            ))}
          </span>
          <span className="whitespace-nowrap">4.9/5 Average Rating</span>
        </div>

        <h1 className="mt-md w-full max-w-[min(100%,36rem)] font-heading text-balance text-h1 text-primary sm:mt-lg md:mt-xl md:max-w-4xl">
          Real Stories from Real Homeowners
        </h1>
        <p className="mx-auto mt-md w-full max-w-[min(100%,34rem)] font-body text-pretty text-body-md text-on-surface-variant sm:mt-lg sm:max-w-2xl md:text-body-lg">
          Discover why thousands of families trust GutterPrecision for gutter maintenance
          and roof protection—documented results, clear quotes, and crews who treat your home
          like their own.
        </p>

        <Link
          href="/contact"
          className={cn(
            "mx-auto mt-md flex min-h-11.5 w-full max-w-70 shrink-0 items-center justify-center rounded-2xl bg-primary px-6 py-md sm:mt-lg sm:w-auto sm:max-w-none sm:min-w-50 md:mt-xl md:px-2xl md:py-lg",
            "font-heading text-label-sm font-bold text-on-primary shadow-md shadow-primary/10",
            "motion-safe:transition-[box-shadow,background-color] motion-safe:duration-200",
            "hover:bg-primary/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          )}
        >
          Write a Review
        </Link>
      </div>

      {/* Full-bleed trust bar — parent page uses overflow-x-clip to avoid w-screen scrollbar */}
      <div className="relative left-1/2 w-dvw  bg-white max-w-[100vw] -translate-x-1/2  ">
        <div
          className={cn(
            "grid gap-8 max-w-7xl mx-auto border-y border-slate-100/90   sm:grid-cols-3 sm:gap-6 sm:px-8 sm:py-5 md:px-12 lg:px-16 xl:px-24",
          )}
        >
          {trustItems.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-sm sm:text-left"
            >
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary-container/25 text-primary">
                <Icon className="size-5" strokeWidth={2} aria-hidden />
              </div>
              <span className="max-w-[16rem] font-heading text-body-sm font-semibold leading-snug text-primary sm:max-w-none md:text-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
