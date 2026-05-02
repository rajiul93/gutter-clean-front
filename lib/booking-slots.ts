export type SlotPeriod = "morning" | "afternoon" | "evening";

const CAPACITY = 3;

/** In-memory counts (demo). Resets on cold start; use a DB in production. */
const booked = new Map<string, number>();

function slotKey(dateISO: string, period: SlotPeriod) {
  return `${dateISO}:${period}`;
}

export function getSlotBookedCount(dateISO: string, period: SlotPeriod): number {
  return booked.get(slotKey(dateISO, period)) ?? 0;
}

export function getSlotRemaining(dateISO: string, period: SlotPeriod): number {
  return CAPACITY - getSlotBookedCount(dateISO, period);
}

export function reserveSlot(
  dateISO: string,
  period: SlotPeriod,
): { ok: true } | { ok: false; error: "full" | "invalid" } {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    return { ok: false, error: "invalid" };
  }
  const key = slotKey(dateISO, period);
  const c = booked.get(key) ?? 0;
  if (c >= CAPACITY) {
    return { ok: false, error: "full" };
  }
  booked.set(key, c + 1);
  return { ok: true };
}
