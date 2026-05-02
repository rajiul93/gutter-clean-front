import { cn, siteContentClass } from "@/lib/utils";
import { Star } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  featured?: boolean;
};

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
    color: "var(--color-primary)",
  },
  quote: {
    fontFamily: fontBody,
    fontSize: "clamp(0.9rem, 0.82rem + 0.3vw, 1rem)",
    lineHeight: 1.65,
    fontWeight: 400,
    fontStyle: "italic",
    color: "#475569",
  },
  name: {
    fontFamily: fontHeading,
    fontSize: "clamp(0.8125rem, 0.76rem + 0.2vw, 0.875rem)",
    lineHeight: 1.3,
    fontWeight: 600,
    color: "var(--color-primary)",
  },
  role: {
    fontFamily: fontBody,
    fontSize: "clamp(0.6875rem, 0.65rem + 0.15vw, 0.75rem)",
    lineHeight: 1.3,
    fontWeight: 400,
    color: "#94a3b8",
  },
};

const starIcon: CSSProperties = {
  width: "clamp(1rem, 2.8vw, 1.25rem)",
  height: "clamp(1rem, 2.8vw, 1.25rem)",
};

const testimonials: Testimonial[] = [
  {
    quote:
      "The level of detail was incredible. They sent me photos of my gutters before and after, showing exactly what was blocked.",
    name: "Sarah J.",
    role: "Homeowner in Seattle",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6WRWTPvgBQyTyc1CLXpSBLNEipb5VCkDhtHPbAY7A4w-kEEzatrVby_x6tvDB-AKImJk6j2b6BfSHm5HVcbmfhp-J4ZACzQiJsnZt7VLxLZgW0lzUzYcd7pxsLU1AKTV2rszWSQTxqEv0-dXQvdc2TH3SoXSxD6g0TaIdGF1cb22fEkzSSyge5aMs6iXTwbUp0t4rpgsv-uVwCvPV2rdo9lL_D2lBZIXvMmWkfzUIStoS6g-QyerZo8XxgO-xJspIZp6TMropSL5L",
    imageAlt: "Portrait of Sarah J.",
    featured: false,
  },
  {
    quote:
      "Professional, punctual, and precise. The booking process was so easy compared to other local companies. Highly recommend.",
    name: "Marcus T.",
    role: "Property Manager",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3t2TOLcbjBwzn_VrUehgJPSuCsz71iJLup8X3xsUc85_KASV-r_PP6Zn2Cy09fWA2eYYnWuLi8lUVYiViSWnQJSdfmTONym4L6QcJyaGA1HEvXraucBqBzomcBgygcGkXd-qU6fDu78WaYQ5sfAAYDGjTasWJzqvAxBJXlbvOt5IcdYak6sX3O3TgZ9onVKlku5QtLXgYoH7TGdT5XmHobZuU9T-TX8us79sOgiAnLqNLD2ZSC7c1gClbi1exSsVKKJwe8iqnUl1o",
    imageAlt: "Portrait of Marcus T.",
    featured: true,
  },
  {
    quote:
      "Finally, a service that feels like it's from this decade. Modern equipment and seamless payment. Gutters look brand new.",
    name: "Elena W.",
    role: "Architect",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB3dElnAAH3YkFYcqnrlej83asR_rhBTY3uv80BleDzULfv0mYK3pnYO5H1E3eU7PkmwbnZoLLLRI0FDQ4244jaPDT8FmUefLpaix5YsCLxmsYDCsRBjb74XNF3J5yfYOXBRyiKpOnPzUqfAR04z6zybNUFagNfLYRF9nRgXzBmgXas2obd4DLqzW1XGMtrFVFqwHYJWsHaqWi05VbgLZ9eij6USe6mOi8jSbrVOjCMUWUMqh_UP6UF0vArWrcDGEP125Tei8V3sSwP",
    imageAlt: "Portrait of Elena W.",
    featured: false,
  },
];

function StarRow() {
  return (
    <div
      className="mb-md flex text-secondary-container"
      style={{ gap: "clamp(0.125rem, 0.5vw, 0.25rem)" }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="fill-secondary-container text-secondary-container"
          strokeWidth={1.25}
          aria-hidden
          style={starIcon}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="overflow-hidden py-huge">
      <div className={siteContentClass}>
        <h2 className="mb-huge text-center" style={type.h2}>
          Raving Homeowners
        </h2>
        <div className="grid gap-lg md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={cn(
                "rounded-2xl border border-slate-50 bg-white p-xl shadow-card",
                t.featured && "z-10 md:scale-105",
              )}
            >
              <StarRow />
              <p className="mb-lg text-pretty" style={type.quote}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center space-x-md">
                <div
                  className="shrink-0 overflow-hidden rounded-full bg-slate-200"
                  style={{
                    width: "clamp(2.75rem, 8vw, 3rem)",
                    height: "clamp(2.75rem, 8vw, 3rem)",
                  }}
                >
                  <Image
                    src={t.image}
                    alt={t.imageAlt}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                </div>
                <div>
                  <p style={type.name}>{t.name}</p>
                  <p style={type.role}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
