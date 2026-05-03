"use client";

import { REVIEW_CATEGORIES, REVIEWS, type ReviewCategory } from "@/app/(public)/review/review-data";
import { cn, siteContentClass } from "@/lib/utils";
import { BadgeCheck, Home, Sparkles, Wrench } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

const PAGE_SIZE = 3;

function ServiceTagIcon({
  category,
}: {
  category: Exclude<ReviewCategory, "all">;
}) {
  const common = "size-3.5 shrink-0 text-primary";
  switch (category) {
    case "gutter":
      return <Sparkles className={common} aria-hidden />;
    case "roof":
      return <Home className={common} aria-hidden />;
    case "repair":
      return <Wrench className={common} aria-hidden />;
    default:
      return null;
  }
}

export function ReviewFeed() {
  const [filter, setFilter] = useState<ReviewCategory>("all");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return REVIEWS.filter((r) => filter === "all" || r.category === filter);
  }, [filter]);

  const shown = filtered.slice(0, visible);
  const canLoadMore = visible < filtered.length;

  return (
    <section className="bg-background pb-lg pt-lg sm:pb-huge sm:pt-xl md:pt-xxl">
      <div className={cn(siteContentClass, "min-w-0")}>
        <div
          className={cn(
            "mb-md flex min-w-0 flex-wrap justify-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-card sm:mb-lg sm:justify-start sm:gap-2.5 sm:rounded-3xl sm:p-4 md:p-lg",
          )}
          role="toolbar"
          aria-label="Filter reviews by service"
        >
          {REVIEW_CATEGORIES.map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setFilter(c.id);
                  setVisible(PAGE_SIZE);
                }}
                className={cn(
                  "min-h-10 min-w-0 touch-manipulation rounded-full px-3 py-2 font-heading text-xs font-semibold sm:min-h-0 sm:px-md sm:py-sm sm:text-sm",
                  "motion-safe:transition-colors motion-safe:duration-200",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  active
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-high text-primary hover:bg-surface-container",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {shown.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low px-md py-xxl text-center font-body text-body-md text-on-surface-variant">
            No reviews match this category.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-md sm:grid-cols-2 sm:gap-lg lg:grid-cols-3 lg:gap-xl">
            {shown.map((r) => (
              <li key={r.id} className="min-w-0">
                <article
                  className={cn(
                    "flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-md shadow-card ring-1 ring-black/6 sm:p-lg",
                  )}
                >
                  <header className="flex gap-3 sm:gap-md">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-secondary-container/20 sm:size-14">
                      <Image
                        src={r.avatar}
                        alt={r.avatarAlt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 48px, 56px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="min-w-0 wrap-break-word font-heading text-sm font-bold text-primary">
                          {r.name}
                        </h3>
                        <span
                          className={cn(
                            "inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary-container/15 px-sm py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide text-secondary",
                          )}
                        >
                          <BadgeCheck className="size-3 shrink-0" aria-hidden />
                          Verified homeowner
                        </span>
                      </div>
                      <p className="mt-0.5 font-body text-xs text-on-surface-variant">{r.location}</p>
                      <div
                        className="mt-sm flex gap-0.5"
                        aria-label={`${r.rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={String(i)}
                            className={cn(
                              "text-base leading-none sm:text-lg",
                              i < r.rating ? "text-secondary" : "text-outline-variant",
                            )}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </header>

                  <p className="mt-md flex-1 font-body text-body-sm leading-relaxed text-on-surface-variant sm:mt-lg">
                    {r.quote}
                  </p>

                  <div
                    className={cn(
                      "mt-md flex min-w-0 items-center gap-2 rounded-2xl bg-surface-container-high px-md py-sm sm:mt-lg",
                      "font-heading text-xs font-semibold text-primary",
                    )}
                  >
                    <ServiceTagIcon category={r.category} />
                    <span className="min-w-0 wrap-break-word">Service: {r.serviceLabel}</span>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        {canLoadMore ? (
          <div className="mt-lg w-full sm:mt-xxl sm:flex sm:justify-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className={cn(
                "flex min-h-12 w-full max-w-none items-center justify-center rounded-2xl bg-surface-container-high px-xl py-md font-heading text-label-sm font-bold text-primary sm:rounded-full sm:px-xxl md:min-h-11",
                "motion-safe:transition-colors motion-safe:duration-200",
                "hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                "sm:w-auto sm:min-w-60",
              )}
            >
              Load More
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
