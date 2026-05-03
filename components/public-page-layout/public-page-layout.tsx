import { siteContentClass } from "@/lib/utils";
import type { ReactNode } from "react";

type PublicPageLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function PublicPageLayout({
  title,
  description,
  children,
}: PublicPageLayoutProps) {
  return (
    <main className="flex flex-1 flex-col pb-huge pt-10">
      <div className={siteContentClass}>
        <h1 className="mb-md font-heading text-h2 text-primary">{title}</h1>
        {description ? (
          <p className="mb-lg max-w-3xl font-body text-body-md text-slate-600">
            {description}
          </p>
        ) : null}
        <div className="space-y-md font-body text-body-md text-slate-700 [&_h2]:mt-xl [&_h2]:font-heading [&_h2]:text-h3 [&_h2]:text-primary [&_li]:mt-1 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </div>
    </main>
  );
}
