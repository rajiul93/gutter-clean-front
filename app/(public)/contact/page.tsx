import { ContactForm } from "@/components/contact-form/contact-form";
import { PublicPageLayout } from "@/components/public-page-layout/public-page-layout";
import Link from "next/link";

export const metadata = {
  title: "Contact | GutterPrecision",
  description: "Reach GutterPrecision for quotes, scheduling, and support.",
};

export default function ContactPage() {
  return (
    <PublicPageLayout
      title="Contact"
      description="We reply to most messages within one business day. For urgent water ingress, write “urgent” in the title."
    >
      <div className="not-prose grid gap-xl lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start">
        <div className="space-y-md">
          <h2>Phone</h2>
          <p>
            <strong>Main line:</strong>{" "}
            <a
              href="tel:+15555550100"
              className="font-medium text-primary underline"
            >
              (555) 555-0100
            </a>{" "}
            <span className="text-slate-500">(replace with your number)</span>
          </p>
          <h2>Email</h2>
          <p>
            <strong>General:</strong>{" "}
            <a
              href="mailto:hello@gutterprecision.example"
              className="font-medium text-primary underline"
            >
              hello@gutterprecision.example
            </a>
          </p>
          <h2>Mailing address</h2>
          <p>
            GutterPrecision
            <br />
            1000 Service Road, Suite 200
            <br />
            Seattle, WA 98101
            <br />
            United States
          </p>
          <h2>Hours</h2>
          <p>
            Monday–Friday: 8:00 a.m. – 6:00 p.m.
            <br />
            Saturday: 9:00 a.m. – 2:00 p.m. (dispatch &amp; callbacks)
            <br />
            Sunday: Closed
          </p>
          <p className="text-slate-600">
            Prefer the site menu?{" "}
            <Link href="/about" className="font-medium text-primary underline">
              About us
            </Link>
            .
          </p>
        </div>
        <div>
          <h2 className="mb-md mt-0 font-heading text-h3 text-primary lg:mt-0">
            Send a message
          </h2>
          <ContactForm />
        </div>
      </div>
    </PublicPageLayout>
  );
}
