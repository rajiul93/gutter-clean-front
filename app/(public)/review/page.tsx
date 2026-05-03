import { ReviewBeforeAfter } from "@/app/(public)/review/review-before-after/review-before-after";
import { ReviewFeed } from "@/app/(public)/review/review-feed/review-feed";
import { ReviewHero } from "@/app/(public)/review/review-hero/review-hero";

export const metadata = {
  title: "Reviews | GutterPrecision",
  description:
    "Read verified homeowner reviews, before-and-after transformations, and why families trust GutterPrecision.",
};

export default function ReviewPage() {
  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-x-clip">
      <ReviewHero />
      <ReviewBeforeAfter />
      <ReviewFeed />
    </main>
  );
}
