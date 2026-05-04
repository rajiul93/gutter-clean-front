import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Phone Call bookings | Admin | GutterPrecision",
};

export default function AdminCallLayout({ children }: { children: ReactNode }) {
  return children;
}
