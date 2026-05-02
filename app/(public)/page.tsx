import { FinalCtaSection } from "@/home/components/final-cta-section";
import { HeroSection } from "@/home/components/hero-section";
import { ProcessTrackerSection } from "@/home/components/process-tracker-section";
import { ServicesBentoSection } from "@/home/components/services-bento-section";
import { TestimonialsSection } from "@/home/components/testimonials-section";
import { WhyChooseUsSection } from "@/home/components/why-choose-us-section";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />
      <ServicesBentoSection />
      <WhyChooseUsSection />
      <ProcessTrackerSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  );
}
