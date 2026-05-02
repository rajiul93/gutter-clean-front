"use client";

import { BookingVoucherPdfDocument } from "@/components/voucher/booking-voucher-pdf-document";
import type { BookingVoucherData } from "@/lib/booking-voucher-data";
import { cn } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";
import { Download, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

export type VoucherDownloadVariant = "primary" | "outline" | "ghost";

type Props = {
  data: BookingVoucherData;
  /** Button label (e.g. &quot;Customer PDF&quot; / &quot;Office PDF&quot;). */
  label?: string;
  /** File name suffix so customer vs office downloads don&apos;t overwrite each other. */
  fileSuffix?: string;
  variant?: VoucherDownloadVariant;
  className?: string;
  /** Smaller padding + text for dense tables. */
  compact?: boolean;
  disabled?: boolean;
};

const variantClass: Record<VoucherDownloadVariant, string> = {
  primary:
    "border-transparent bg-primary-container text-white hover:brightness-110 shadow-sm",
  outline:
    "border-slate-200 bg-white text-slate-800 hover:border-primary/40 hover:bg-slate-50",
  ghost: "border-transparent bg-transparent text-primary hover:bg-primary/5",
};

export function VoucherDownloadButton({
  data,
  label = "Download voucher",
  fileSuffix,
  variant = "primary",
  className,
  compact,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onClick = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const blob = await pdf(<BookingVoucherPdfDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const shortId = data.bookingId.replace(/[^a-zA-Z0-9]/g, "").slice(-10) || "booking";
      const suffix = fileSuffix ? `-${fileSuffix}` : "";
      a.download = `service-voucher-${shortId}${suffix}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setErr("Could not generate PDF.");
    } finally {
      setLoading(false);
    }
  }, [data, fileSuffix]);

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl border font-heading font-semibold transition disabled:opacity-50",
          compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm",
          variantClass[variant],
        )}
      >
        {loading ? (
          <Loader2 className={cn("shrink-0 animate-spin", compact ? "size-3.5" : "size-4")} />
        ) : (
          <Download className={cn("shrink-0", compact ? "size-3.5" : "size-4")} aria-hidden />
        )}
        {label}
      </button>
      {err ? <p className="text-xs font-medium text-error">{err}</p> : null}
    </div>
  );
}
