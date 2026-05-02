"use client";

import { VoucherDownloadButton } from "@/components/voucher/voucher-download-button";
import {
  buildBookingVoucherData,
  type BookingVoucherRow,
  type VoucherCopy,
} from "@/lib/booking-voucher-data";
import { cn } from "@/lib/utils";

type Props = {
  row: BookingVoucherRow;
  /** Which PDF variants to show (customer = homeowner; provider = office). */
  copies?: VoucherCopy[];
  variant?: "primary" | "outline" | "ghost";
  compact?: boolean;
  className?: string;
};

const defaultCopies: VoucherCopy[] = ["customer", "provider"];

export function VoucherDownloadGroup({
  row,
  copies = defaultCopies,
  variant = "outline",
  compact = false,
  className,
}: Props) {
  const buttons = copies.flatMap((copy) => {
    const data = buildBookingVoucherData(row, copy);
    if (!data) return [];
    return [
      <VoucherDownloadButton
        key={copy}
        data={data}
        variant={variant}
        compact={compact}
        label={copy === "customer" ? "Customer PDF" : "Office PDF"}
        fileSuffix={copy === "customer" ? "customer" : "office"}
      />,
    ];
  });

  if (!buttons.length) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-stretch gap-2",
        compact ? "max-w-[14rem]" : "",
        className,
      )}
    >
      {buttons}
    </div>
  );
}
