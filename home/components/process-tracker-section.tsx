import { cn, siteContentClass } from "@/lib/utils";
import {
  CalendarDays,
  ClipboardCheck,
  Compass,
  Wrench,
  type LucideIcon,
} from "lucide-react";
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
    fontSize: "clamp(0.9rem, 0.82rem + 0.35vw, 1rem)",
    lineHeight: 1.6,
    fontWeight: 400,
    color: "rgba(255, 255, 255, 0.72)",
  },
  stepTitle: {
    fontFamily: fontHeading,
    fontSize: "clamp(1rem, 0.85rem + 0.85vw, 1.5rem)",
    lineHeight: 1.3,
    fontWeight: 700,
    color: "#ffffff",
  },
  stepDesc: {
    fontFamily: fontBody,
    fontSize: "clamp(0.78rem, 0.72rem + 0.22vw, 0.875rem)",
    lineHeight: 1.45,
    fontWeight: 400,
    color: "rgba(255, 255, 255, 0.72)",
  },
};

const circleShell: CSSProperties = {
  width: "clamp(4rem, 10vw, 6rem)",
  height: "clamp(4rem, 10vw, 6rem)",
  marginBottom: "clamp(0.5rem, 0.35rem + 0.6vw, 1rem)",
};

const iconGlyph: CSSProperties = {
  width: "clamp(1.65rem, 4.5vw, 2.35rem)",
  height: "clamp(1.65rem, 4.5vw, 2.35rem)",
};

const steps: {
  title: string;
  description: string;
  icon: LucideIcon;
  circleClass: string;
}[] = [
  {
    title: "Book",
    description: "30-second digital booking process.",
    icon: CalendarDays,
    circleClass: "bg-white text-primary shadow-lg",
  },
  {
    title: "Analyze",
    description: "On-site precision assessment.",
    icon: Compass,
    circleClass: "bg-secondary-container text-primary shadow-lg",
  },
  {
    title: "Execute",
    description: "Certified precision maintenance.",
    icon: Wrench,
    circleClass: "bg-white text-primary shadow-lg",
  },
  {
    title: "Verify",
    description: "Final digital report & sign-off.",
    icon: ClipboardCheck,
    circleClass: "bg-white text-primary shadow-lg",
  },
];

export function ProcessTrackerSection() {
  return (
    <section className="bg-primary py-huge text-white">
      <div className={siteContentClass}>
        <div className="mb-huge text-center">
          <h2 className="mb-md" style={type.h2}>
            Streamlined From Start to Finish
          </h2>
          <p style={type.lead}>
            The most transparent service experience in the industry.
          </p>
        </div>
        <div className="relative flex flex-col items-start justify-between space-y-xl md:flex-row md:space-y-0">
          <div
            className="absolute left-0 hidden h-0.5 w-full bg-white/20 md:block"
            style={{ top: "clamp(2.5rem, 6vw, 3.25rem)" }}
            aria-hidden
          />
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="relative z-10 flex w-full flex-col items-center text-center md:w-1/4"
              >
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-full",
                    step.circleClass,
                  )}
                  style={circleShell}
                >
                  <Icon
                    strokeWidth={2}
                    aria-hidden
                    style={iconGlyph}
                  />
                </div>
                <h4 className="mb-xs" style={type.stepTitle}>
                  {step.title}
                </h4>
                <p className="" style={type.stepDesc}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
