import { cn, siteContentClass } from "@/lib/utils";
import Link from "next/link";
import {
  BrushCleaning,
  Droplets,
  Eye,
  Home,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

const services: {
  icon: LucideIcon;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}[] = [
  {
    icon: BrushCleaning,
    title: "Gutter Cleaning",
    description:
      "Professional debris removal and system health check.",
    image: "/1.png",
    imageAlt: "Technician on a ladder cleaning gutters on a house",
  },
  {
    icon: Home,
    title: "Roof Cleaning",
    description:
      "Moss removal and preventative treatment for shingles.",
    image: "/2.png",
    imageAlt: "Close-up of a residential roof and shingles",
  },
  {
    icon: Droplets,
    title: "Downpipe Flushing",
    description:
      "High-pressure flush to clear underground blockages.",
    image: "/3.png",
    imageAlt: "Water flowing from a roof gutter downpipe",
  },
  {
    icon: Eye,
    title: "Inspection",
    description:
      "Comprehensive visual and drone-assisted reporting.",
    image: "/4.png",
    imageAlt: "Construction site review and building inspection",
  },
];

export function ServicesBentoSection() {
  return (
    <section className="bg-surface-container-lowest py-huge">
      <div className={siteContentClass}>
        <div className="mb-huge text-center">
          <h2 className="mb-md text-balance font-heading text-h2 text-primary">
            Our Service Suite
          </h2>
          <p className="mx-auto max-w-2xl text-pretty font-body text-body-md text-on-surface-variant">
            Four core services covering gutters, roofline care, downpipes, and
            inspections—visit{" "}
            <Link href="/contact" className="font-medium text-primary underline">
              Contact
            </Link>{" "}
            anytime for scheduling or questions.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className={cn(
                  "relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition-all duration-300",
                  "hover:-translate-y-1",
                )}
              >
                <div className="relative aspect-[16/10] w-full bg-surface-container">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div
                    className="pointer-events-none absolute right-3 top-3 z-10 sm:right-3.5 sm:top-3.5"
                    aria-hidden
                  >
                    <div
                      className={cn(
                        "inline-flex size-9 items-center justify-center rounded-full",
                        "border border-white/70 bg-white/90 text-primary shadow-md backdrop-blur-sm",
                        "ring-1 ring-black/[0.06] sm:size-10",
                      )}
                    >
                      <Icon
                        className="size-[17px] shrink-0 sm:size-[19px]"
                        strokeWidth={2}
                        aria-hidden
                      />
                    </div>
                  </div>
                </div>
                <div className="p-sm sm:p-md ">
                  <h4 className="mb-1 text-balance font-heading text-sm font-semibold leading-snug tracking-tight text-primary sm:text-[0.9375rem]">
                    {service.title}
                  </h4>
                  <p className="text-pretty font-body text-xs leading-relaxed text-slate-600 sm:text-[0.8125rem]">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
