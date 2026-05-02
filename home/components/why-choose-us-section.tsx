"use client";

import { cn, siteContentClass } from "@/lib/utils";
import {
  CircleCheck,
  Factory,
  Leaf,
  type LucideIcon,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const bullets = [
  "High-Resolution Before/After Photos",
  "Digital Inspection Reports",
  "Certified & Insured Technicians",
];

const fontHeading = "var(--font-manrope), ui-sans-serif, system-ui, sans-serif";
const fontBody =
  "var(--font-work-sans), ui-sans-serif, system-ui, sans-serif";

/** Fluid type via inline `clamp()` only — no global CSS additions. */
const type: Record<string, CSSProperties> = {
  h2: {
    fontFamily: fontHeading,
    fontSize: "clamp(1.5rem, 1rem + 2.4vw, 2.25rem)",
    lineHeight: 1.2,
    letterSpacing: "-0.01em",
    fontWeight: 700,
  },
  body: {
    fontFamily: fontBody,
    fontSize: "clamp(0.9rem, 0.82rem + 0.35vw, 1rem)",
    lineHeight: 1.65,
    fontWeight: 400,
  },
  cardTitle: {
    fontFamily: fontHeading,
    fontSize: "clamp(0.9rem, 0.72rem + 1vw, 1.35rem)",
    lineHeight: 1.25,
    fontWeight: 700,
  },
  bullet: {
    fontFamily: fontBody,
    fontSize: "clamp(0.78rem, 0.72rem + 0.25vw, 0.875rem)",
    lineHeight: 1.4,
    fontWeight: 600,
  },
  button: {
    fontFamily: fontHeading,
    fontSize: "clamp(0.78rem, 0.72rem + 0.2vw, 0.875rem)",
    lineHeight: 1.2,
    fontWeight: 600,
  },
};

const iconLg: CSSProperties = {
  width: "clamp(1.75rem, 4vw, 2.5rem)",
  height: "clamp(1.75rem, 4vw, 2.5rem)",
  marginBottom: "clamp(0.5rem, 0.35rem + 0.5vw, 1rem)",
};

const iconBullet: CSSProperties = {
  width: "clamp(1.05rem, 2.5vw, 1.35rem)",
  height: "clamp(1.05rem, 2.5vw, 1.35rem)",
};

const featureCards: {
  title: string;
  Icon: LucideIcon;
  delayClass: "why-feature-card-d0" | "why-feature-card-d1" | "why-feature-card-d2" | "why-feature-card-d3";
  surface: string;
  iconClass?: string;
  titleClass?: string;
}[] = [
  {
    title: "24h Response",
    Icon: Zap,
    delayClass: "why-feature-card-d0",
    surface: "bg-surface-container-low",
    iconClass: "text-primary",
    titleClass: "text-primary",
  },
  {
    title: "Precision Tech",
    Icon: Factory,
    delayClass: "why-feature-card-d1",
    surface: "bg-primary text-white",
  },
  {
    title: "Eco-Safe",
    Icon: Leaf,
    delayClass: "why-feature-card-d2",
    surface: "bg-secondary-container text-primary",
  },
  {
    title: "Lifetime Warranty",
    Icon: Shield,
    delayClass: "why-feature-card-d3",
    surface: "bg-surface-container-low",
    iconClass: "text-primary",
    titleClass: "text-primary",
  },
];

function FeatureCardGrid() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const col1 = featureCards.slice(0, 2);
  const col2 = featureCards.slice(2, 4);

  return (
    <div ref={rootRef} className="grid grid-cols-2 gap-md">
      <div className="space-y-md">
        {col1.map(({ title, Icon, delayClass, surface, iconClass, titleClass }) => (
          <div
            key={title}
            className={cn(
              "why-feature-card group relative flex aspect-square flex-col justify-center overflow-hidden rounded-2xl p-xl will-change-transform",
              delayClass,
              surface,
              visible && "why-feature-card--visible",
              "motion-safe:ring-1 motion-safe:ring-black/4 motion-safe:transition-[transform,box-shadow,filter] motion-safe:duration-500 motion-safe:ease-out",
              "motion-safe:hover:z-10 motion-safe:hover:scale-[1.03] motion-safe:hover:brightness-[1.02]",
            )}
          >
            <span className="why-feature-card__icon inline-flex shrink-0" style={{ marginBottom: iconLg.marginBottom }}>
              <Icon
                className={cn(iconClass)}
                strokeWidth={2}
                aria-hidden
                style={{ width: iconLg.width, height: iconLg.height }}
              />
            </span>
            <p className={cn(titleClass)} style={type.cardTitle}>
              {title}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-md pt-xl">
        {col2.map(({ title, Icon, delayClass, surface, iconClass, titleClass }) => (
          <div
            key={title}
            className={cn(
              "why-feature-card group relative flex aspect-square flex-col justify-center overflow-hidden rounded-2xl p-xl will-change-transform",
              delayClass,
              surface,
              visible && "why-feature-card--visible",
              "motion-safe:ring-1 motion-safe:ring-black/4 motion-safe:transition-[transform,box-shadow,filter] motion-safe:duration-500 motion-safe:ease-out",
              "motion-safe:hover:z-10 motion-safe:hover:scale-[1.03] motion-safe:hover:brightness-[1.02]",
            )}
          >
            <span className="why-feature-card__icon inline-flex shrink-0" style={{ marginBottom: iconLg.marginBottom }}>
              <Icon
                className={cn(iconClass)}
                strokeWidth={2}
                aria-hidden
                style={{ width: iconLg.width, height: iconLg.height }}
              />
            </span>
            <p className={cn(titleClass)} style={type.cardTitle}>
              {title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhyChooseUsSection() {
  return (
    <section className="py-huge">
      <div className={siteContentClass}>
        <div className="grid items-center gap-huge lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <FeatureCardGrid />
          </div>
          <div className="order-1 space-y-lg lg:order-2">
            <h2 className="text-primary" style={type.h2}>
              Why Homeowners Trust GutterPrecision
            </h2>
            <p className="text-slate-600" style={type.body}>
              We don&apos;t just clean; we optimize your home&apos;s water
              management system. Using proprietary tools and a data-driven
              approach, we ensure your investment is protected from water damage.
            </p>
            <ul className="space-y-md">
              {bullets.map((item) => (
                <li key={item} className="flex items-center space-x-md">
                  <CircleCheck
                    className="shrink-0 fill-secondary-container text-secondary-container"
                    strokeWidth={2}
                    aria-hidden
                    style={iconBullet}
                  />
                  <span className="text-on-background" style={type.bullet}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className={cn(
                "inline-flex items-center justify-center rounded-2xl bg-primary px-xl py-md text-white transition-all",
                "hover:bg-secondary",
              )}
              style={type.button}
            >
              Get a free quote
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
