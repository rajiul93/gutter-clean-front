import { PublicPageLayout } from "@/components/public-page-layout/public-page-layout";

export const metadata = {
  title: "Terms of Service | GutterPrecision",
  description: "Terms and conditions for using GutterPrecision services and website.",
};

export default function TermsOfServicePage() {
  return (
    <PublicPageLayout
      title="Terms of Service"
      description="Last updated: May 2026. Please read these terms before booking or using our website."
    >
      <h2>Agreement</h2>
      <p>
        By requesting a quote, booking service, or using gutterprecision.com, you
        agree to these terms and to any written estimate or work order provided
        for your specific job.
      </p>
      <h2>Services</h2>
      <p>
        We perform exterior maintenance as described in your booking or contract.
        Scope, pricing, and timing may be confirmed in writing before work
        begins. Weather, site conditions, or hidden defects may require a
        revised plan—we will explain changes before proceeding when possible.
      </p>
      <h2>Access & safety</h2>
      <p>
        You agree to provide safe access to the work area (power if needed,
        clear paths, pets secured). We may refuse or pause work if conditions are
        unsafe.
      </p>
      <h2>Payment</h2>
      <p>
        Payment terms appear on your invoice or estimate. Late or failed payments
        may incur fees where permitted by law. Chargebacks without first
        contacting us may affect future service eligibility.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, GutterPrecision is not liable for
        indirect or consequential damages arising from use of the site or
        services. Nothing in these terms limits liability that cannot be limited
        under applicable law.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site
        or services after updates constitutes acceptance of the revised terms.
      </p>
    </PublicPageLayout>
  );
}
