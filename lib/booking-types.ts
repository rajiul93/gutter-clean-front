import type { JobSize, ServiceId } from "@/lib/booking-pricing";
import type { SlotPeriod } from "@/lib/booking-slots";

export type SubmitBookingInput = {
  dateISO: string;
  slot: SlotPeriod;
  serviceId: ServiceId;
  featureIds: string[];
  size: JobSize;
  name: string;
  email: string;
  phone: string;
  location: string;
};
