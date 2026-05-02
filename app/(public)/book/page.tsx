import { BookingWizard } from "@/app/(public)/book/components/booking-wizard";
import { siteContentClass } from "@/lib/utils";

export const metadata = {
  title: "Book a service",
  description: "Schedule gutter, roof, downpipe, or inspection services.",
};

export default function BookPage() {
  return (
    <div className="min-h-[70vh] min-w-0 overflow-x-clip bg-surface py-huge">
      <div className={`${siteContentClass} min-w-0`}>
        <BookingWizard />
      </div>
    </div>
  );
}
