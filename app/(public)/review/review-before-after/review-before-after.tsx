import { cn, siteContentClass } from "@/lib/utils";
import Image from "next/image";

type BeforeAfterItem = {
  title: string;
  description: string;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
};

const items: BeforeAfterItem[] = [
  {
    title: "Estate Maintenance Package",
    description: "Completed in 45 minutes for a residence in Silver Lake.",
    beforeSrc:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=560&q=80",
    afterSrc:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=560&q=80",
    beforeAlt: "Roofline and gutters before deep clean",
    afterAlt: "Roofline and gutters after gutter cleaning service",
  },
  {
    title: "Roof Restoration System",
    description: "Extended roof life by 5 years for this Oak Ridge home.",
    beforeSrc:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=560&q=80",
    afterSrc:
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=560&q=80",
    beforeAlt: "Worn roof shingles before treatment",
    afterAlt: "Restored roof shingles after rejuvenation treatment",
  },
];

export function ReviewBeforeAfter() {
  return (
    <section className=" py-lg sm:py-xl bg-background md:py-xxl">
      <div className={siteContentClass}>
        <div className="mx-auto max-w-3xl px-0 pb-md text-center sm:pb-lg md:pb-xl">
          <h2 className="font-heading text-balance text-h2 text-primary">Seeing is Believing</h2>
          <p className="mx-auto mt-md max-w-2xl font-body text-body-md text-on-surface-variant md:text-body-lg">
            Real transformations from our recent service appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-md sm:gap-lg md:grid-cols-2 md:gap-xl">
          {items.map((item) => (
            <article
              key={item.title}
              className={cn(
                "flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-black/6 sm:rounded-3xl",
              )}
            >
              <div className="relative flex aspect-16/10 w-full min-h-0 divide-x divide-white/90">
                <div className="relative min-h-0 w-1/2">
                  <Image
                    src={item.beforeSrc}
                    alt={item.beforeAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw"
                  />
                  <span
                    className={cn(
                      "absolute left-2 top-2 rounded-full bg-slate-900/88 px-2 py-1 font-heading text-[9px] font-bold uppercase tracking-wider text-white sm:left-3 sm:top-3 sm:px-2.5 sm:text-[10px]",
                    )}
                  >
                    Before
                  </span>
                </div>
                <div className="relative min-h-0 w-1/2">
                  <Image
                    src={item.afterSrc}
                    alt={item.afterAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 639px) 50vw, (max-width: 1023px) 50vw, 33vw"
                  />
                  <span
                    className={cn(
                      "absolute left-2 top-2 rounded-full bg-secondary px-2 py-1 font-heading text-[9px] font-bold uppercase tracking-wider text-on-secondary sm:left-3 sm:top-3 sm:px-2.5 sm:text-[10px]",
                    )}
                  >
                    After
                  </span>
                </div>
              </div>
              <div className="space-y-sm p-md sm:p-lg">
                <h3 className="font-heading text-base font-bold leading-snug text-primary sm:text-lg">
                  {item.title}
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
