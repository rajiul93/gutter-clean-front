import { getService, isValidServiceId, type ServiceId } from "@/lib/booking-pricing";
import { formatUsd } from "@/lib/utils";

/** Who this PDF is labelled for (same facts; different footer / title line). */
export type VoucherCopy = "customer" | "provider";

/** Minimal booking shape for building a voucher (user + admin rows). */
export type BookingVoucherRow = {
  _id: string;
  dateISO: string;
  slot: string;
  serviceId: string;
  featureIds?: string[];
  size?: string;
  name?: string;
  email?: string;
  phone?: string;
  location: string;
  total: number;
  status: string;
  createdAt?: string;
};

export type BookingVoucherData = {
  bookingId: string;
  voucherCopy: VoucherCopy;
  dateISO: string;
  slotLabel: string;
  serviceTitle: string;
  featureSummary: string;
  sizeLabel: string;
  customerName: string;
  email: string;
  phone: string;
  location: string;
  totalFormatted: string;
  issuedAtFormatted: string;
};

export function slotLabelForVoucher(slot: string): string {
  if (!slot) return "—";
  return slot.charAt(0).toUpperCase() + slot.slice(1);
}

function featureSummary(serviceId: string, featureIds?: string[]): string {
  if (!isValidServiceId(serviceId)) return "—";
  const svc = getService(serviceId as ServiceId);
  if (!featureIds?.length) return "None";
  const labels = featureIds
    .map((id) => svc.features.find((f) => f.id === id)?.label)
    .filter(Boolean);
  return labels.length ? labels.join(", ") : "None";
}

/** Only completed jobs get a voucher. */
export function buildBookingVoucherData(
  row: BookingVoucherRow,
  voucherCopy: VoucherCopy,
): BookingVoucherData | null {
  if (row.status !== "completed") return null;

  const serviceTitle = isValidServiceId(row.serviceId)
    ? getService(row.serviceId as ServiceId).title
    : row.serviceId;

  return {
    bookingId: row._id,
    voucherCopy,
    dateISO: row.dateISO,
    slotLabel: slotLabelForVoucher(row.slot),
    serviceTitle,
    featureSummary: featureSummary(row.serviceId, row.featureIds),
    sizeLabel: row.size ? String(row.size) : "—",
    customerName: row.name?.trim() || "—",
    email: row.email?.trim() || "—",
    phone: row.phone?.trim() || "—",
    location: row.location,
    totalFormatted: formatUsd(row.total),
    issuedAtFormatted: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };
}
