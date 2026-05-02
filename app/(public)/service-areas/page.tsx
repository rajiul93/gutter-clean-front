import { PublicPageLayout } from "@/components/public-page-layout/public-page-layout";
import Link from "next/link";

export const metadata = {
  title: "Service Areas | GutterPrecision",
  description: "Regions and communities GutterPrecision serves for gutter and exterior maintenance.",
};

export default function ServiceAreasPage() {
  return (
    <PublicPageLayout
      title="Service Areas"
      description="We focus on neighborhoods where we can arrive on time, complete work safely, and support warranties properly. Coverage expands as our crews grow—ask if your address qualifies."
    >
      <h2>Primary coverage</h2>
      <p>
        Typical service radius includes metro and suburban areas within a
        reasonable drive of our dispatch hubs. Exact ZIP codes and seasonal
        availability are confirmed when you book.
      </p>
      <h2>How to check your address</h2>
      <p>
        The fastest way is to submit a request through our{" "}
        <Link href="/contact" className="font-medium text-primary underline">
          Contact
        </Link>{" "}
        form or call during business hours. Please include your full address and
        a short note about the work you need (gutter clean, roof wash, inspection,
        etc.).
      </p>
      <h2>Out-of-area jobs</h2>
      <p>
        For larger projects or property managers with multiple sites, we
        sometimes schedule coordinated visits outside the usual radius. Minimum
        charges and travel fees may apply and will be quoted up front.
      </p>
      <h2>Seasonal demand</h2>
      <p>
        After heavy storms, wait times may increase. We prioritize emergency
        blockages and repeat maintenance customers with active plans when
        capacity is limited.
      </p>
    </PublicPageLayout>
  );
}
