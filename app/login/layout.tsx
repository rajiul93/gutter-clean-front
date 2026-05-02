import type { ReactNode } from "react";
import { Suspense } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface text-slate-600">
          Loading…
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
