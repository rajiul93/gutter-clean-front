import { cn } from "@/lib/utils";
import { Phone } from "lucide-react";
import Link from "next/link";

/** Same demo number as hero / contact / final CTA. */
const CALL_HREF = "tel:+15555550100";

export function StickyCallButton() {
  return (
    <Link
      href={CALL_HREF}
      className={cn(
        "fixed bottom-5 right-5 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-on-primary shadow-lg shadow-primary/25 md:bottom-8 md:right-8 md:size-16",
        "transition-[transform,box-shadow,filter] duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-xl motion-safe:hover:shadow-primary/30",
        "active:scale-[0.96]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
      )}
      aria-label="Call us now"
    >
      <Phone
        className={cn("hero-phone-blink size-7 shrink-0 md:size-8")}
        strokeWidth={2.25}
        aria-hidden
      />
    </Link>
  );
}
