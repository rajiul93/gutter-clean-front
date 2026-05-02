import { create } from "zustand";

import type { JobSize, ServiceId } from "@/lib/booking-pricing";
import type { SlotPeriod } from "@/lib/booking-slots";

export type BookingStep = 1 | 2 | 3;

const initial = {
  step: 1 as BookingStep,
  serviceId: null as ServiceId | null,
  featureIds: [] as string[],
  size: "medium" as JobSize,
  dateISO: null as string | null,
  slot: null as SlotPeriod | null,
  name: "",
  email: "",
  phone: "",
  location: "",
};

type ContactPatch = Partial<
  Pick<typeof initial, "name" | "email" | "phone" | "location">
>;

type BookingState = typeof initial & {
  setStep: (s: BookingStep) => void;
  setService: (id: ServiceId | null) => void;
  toggleFeature: (id: string) => void;
  setSize: (s: JobSize) => void;
  setDate: (iso: string | null) => void;
  setSlot: (p: SlotPeriod | null) => void;
  setContact: (patch: ContactPatch) => void;
  reset: () => void;
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initial,
  setStep: (step) => set({ step }),
  setService: (serviceId) => set({ serviceId, featureIds: [] }),
  toggleFeature: (id) =>
    set((s) => ({
      featureIds: s.featureIds.includes(id)
        ? s.featureIds.filter((x) => x !== id)
        : [...s.featureIds, id],
    })),
  setSize: (size) => set({ size }),
  setDate: (dateISO) => set({ dateISO, slot: null }),
  setSlot: (slot) => set({ slot }),
  setContact: (patch) => set(patch),
  reset: () => set({ ...initial }),
}));
