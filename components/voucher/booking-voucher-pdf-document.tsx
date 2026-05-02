import type { BookingVoucherData } from "@/lib/booking-voucher-data";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const BRAND = "GutterCare";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0f172a",
    lineHeight: 1.45,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#ecfdf5",
    color: "#065f46",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderRadius: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0c4a6e",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 20,
  },
  rule: {
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  label: {
    width: "28%",
    fontFamily: "Helvetica-Bold",
    color: "#64748b",
    fontSize: 9,
  },
  value: {
    width: "72%",
    color: "#0f172a",
    fontSize: 10,
  },
  valueMultiline: {
    width: "72%",
    color: "#0f172a",
    fontSize: 10,
    lineHeight: 1.5,
  },
  footer: {
    marginTop: 28,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.5,
  },
  footerStrong: {
    fontFamily: "Helvetica-Bold",
    color: "#334155",
    marginBottom: 4,
  },
});

function copyTitle(copy: BookingVoucherData["voucherCopy"]): string {
  return copy === "customer" ? "Customer copy" : "Office / provider copy";
}

function copyNote(copy: BookingVoucherData["voucherCopy"]): string {
  return copy === "customer"
    ? "Thank you for choosing our team. This voucher confirms your completed service."
    : "Internal record — completed service. Retain for billing and quality records.";
}

type Props = { data: BookingVoucherData };

export function BookingVoucherPdfDocument({ data }: Props) {
  return (
    <Document title={`Service voucher ${data.bookingId}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.badge}>COMPLETED · SERVICE VOUCHER</Text>
        <Text style={styles.title}>{BRAND}</Text>
        <Text style={styles.subtitle}>
          {copyTitle(data.voucherCopy)} · Issued {data.issuedAtFormatted}
        </Text>
        <View style={styles.rule} />

        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{data.dateISO}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Session</Text>
          <Text style={styles.value}>{data.slotLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Booking ID</Text>
          <Text style={styles.value}>{data.bookingId}</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Service</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{data.serviceTitle}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Add-ons</Text>
          <Text style={styles.value}>{data.featureSummary}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Job size</Text>
          <Text style={styles.value}>{data.sizeLabel}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.value}>{data.totalFormatted}</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Customer & site</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{data.customerName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{data.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{data.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.valueMultiline}>{data.location}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerStrong}>{copyNote(data.voucherCopy)}</Text>
          <Text>
            This document was generated electronically and is valid without a signature when the
            booking status is &quot;completed&quot; in our system.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
