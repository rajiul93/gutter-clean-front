import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      {/* `pt-24` clears the fixed navbar (~88px tall: logo h-14 + py-4). */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pt-20">{children}</div>
      <Footer />
    </div>
  );
}
