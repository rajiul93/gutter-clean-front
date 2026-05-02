import type { Metadata } from "next";
import { Manrope, Work_Sans } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "GutterPrecision | Professional Home Maintenance",
  description:
    "Professional gutter and roof services with high-tech precision. Book certified, insured exterior care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${manrope.variable} ${workSans.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-white font-body text-on-background antialiased"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
