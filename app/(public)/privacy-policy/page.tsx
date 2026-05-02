import { PublicPageLayout } from "@/components/public-page-layout/public-page-layout";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | GutterPrecision",
  description: "How GutterPrecision collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PublicPageLayout
      title="Privacy Policy"
      description="Last updated: May 2026. This policy describes how we handle information when you use our website or services."
    >
      <h2>Information we collect</h2>
      <p>We may collect:</p>
      <ul>
        <li>
          <strong>Contact details</strong> you provide (name, phone, email,
          address) when you request a quote, book service, or contact us.
        </li>
        <li>
          <strong>Job-related information</strong> such as property access notes,
          photos from inspections, and payment status needed to complete work.
        </li>
        <li>
          <strong>Technical data</strong> from the site (for example device type,
          browser, and basic analytics) to improve performance and security.
        </li>
      </ul>
      <h2>How we use information</h2>
      <p>We use this information to:</p>
      <ul>
        <li>Schedule, perform, and document services you requested.</li>
        <li>Communicate about appointments, safety, and billing.</li>
        <li>Comply with law, enforce our agreements, and protect our customers and staff.</li>
      </ul>
      <h2>Sharing</h2>
      <p>
        We do not sell your personal information. We may share data with
        payment processors, insurers when required for a claim, or authorities
        when legally obligated.
      </p>
      <h2>Retention & security</h2>
      <p>
        We keep information only as long as needed for operations, legal
        compliance, and warranty support. We use reasonable administrative and
        technical safeguards appropriate to our business size.
      </p>
      <h2>Your choices</h2>
      <p>
        You may request access, correction, or deletion of certain personal data
        where applicable law allows. Contact us using the details on the{" "}
        <Link href="/contact" className="font-medium text-primary underline">
          Contact
        </Link>{" "}
        page.
      </p>
    </PublicPageLayout>
  );
}
