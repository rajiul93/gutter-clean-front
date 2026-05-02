import { PublicPageLayout } from "@/components/public-page-layout/public-page-layout";

export const metadata = {
  title: "About Us | GutterPrecision",
  description:
    "Learn about GutterPrecision—certified exterior maintenance, our mission, and how we protect your home.",
};

export default function AboutPage() {
  return (
    <PublicPageLayout
      title="About GutterPrecision"
      description="Professional gutter, roof, and exterior care built on safety, transparency, and long-term protection for your home."
    >
      <p>
        GutterPrecision is a home exterior maintenance company focused on
        gutters, roofs, and water management. We combine careful hands-on work
        with clear reporting so you always know what was done and why it
        matters.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li>
          <strong>Safety first</strong> — trained technicians, proper equipment,
          and full insurance.
        </li>
        <li>
          <strong>Honest assessments</strong> — photos and notes you can keep,
          not vague promises.
        </li>
        <li>
          <strong>Long-term protection</strong> — we aim to extend the life of
          your roofline and drainage, not rush a quick fix.
        </li>
      </ul>
      <h2>Our team</h2>
      <p>
        Field crews are vetted, insured, and experienced with steep roofs,
        multi-story homes, and tight urban lots. Office staff help with
        scheduling, documentation, and follow-up so nothing falls through the
        cracks.
      </p>
      <h2>Service promise</h2>
      <p>
        If something is not right after a visit, contact us within the guarantee
        window noted on your job summary and we will make it right—because trust
        is built one job at a time.
      </p>
    </PublicPageLayout>
  );
}
