"use client";

import { getFirebaseAuth } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getRedirectResult,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { ArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function authErrorCode(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    return String((err as { code: string }).code);
  }
  return "";
}

/** `signInWithRedirect` returns without `?next=` — keep target until `getRedirectResult` runs. */
const GOOGLE_REDIRECT_NEXT_KEY = "gutter:auth:redirectNext";

/** Only same-origin paths (avoid open redirects). */
function safeInternalPath(raw: string | null): string {
  const d = (raw ?? "").trim() || "/dashboard";
  if (!d.startsWith("/") || d.startsWith("//")) return "/dashboard";
  if (d.includes("://")) return "/dashboard";
  return d;
}

function googleSignInMessage(err: unknown): string {
  const code = authErrorCode(err);
  switch (code) {
    case "auth/popup-closed-by-user":
      return "The Google sign-in window was closed. Try again when you’re ready.";
    case "auth/operation-not-allowed":
      return "Google sign-in is turned off in Firebase. Enable it: Firebase Console → Authentication → Sign-in method → Google.";
    case "auth/unauthorized-domain":
      return "This domain is not allowed. Add it under Firebase Console → Authentication → Settings → Authorized domains.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists for this email with a different sign-in method. Use email/password or link accounts in Firebase.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/invalid-api-key":
      return "Invalid Firebase API key. Check NEXT_PUBLIC_FIREBASE_API_KEY in .env and restart the dev server.";
    case "auth/argument-error":
      return "Firebase Auth setup error. Hard-refresh this page (or restart `pnpm dev`). If it persists, check NEXT_PUBLIC_FIREBASE_* in .env and Firebase Console → Authorized domains.";
    default:
      return code
        ? `Google sign-in failed (${code}). Check Firebase config and authorized domains.`
        : "Google sign-in failed. Please try again.";
  }
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeInternalPath(searchParams.get("next"));

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  /** After `signInWithRedirect`, Firebase returns here — complete navigation to stored `next`. */
  useEffect(() => {
    const auth = getFirebaseAuth();
    void getRedirectResult(auth)
      .then((result) => {
        if (!result?.user) return;
        let target = next;
        try {
          const stored = sessionStorage.getItem(GOOGLE_REDIRECT_NEXT_KEY);
          if (stored) {
            target = stored;
            sessionStorage.removeItem(GOOGLE_REDIRECT_NEXT_KEY);
          }
        } catch {
          /* sessionStorage blocked */
        }
        router.replace(target);
      })
      .catch((err: unknown) => {
        if (!authErrorCode(err)) return;
        setError(googleSignInMessage(err));
      });
  }, [next, router]);

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      const auth = getFirebaseAuth();
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.replace(next);
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && 'code' in err ? String(err.code) : '';
      if (code === 'auth/email-already-in-use') {
        setError('That email is already registered. Try signing in instead.');
      } else if (
        code === 'auth/invalid-credential' ||
        code === 'auth/wrong-password'
      ) {
        setError('Invalid email or password.');
      } else if (code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Could not complete sign-in. Please try again.');
      }
    } finally {
      setPending(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setPending(true);
    if (
      typeof process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "string" ||
      !process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      typeof process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== "string" ||
      !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ) {
      setError(
        "Firebase web config is missing. Copy NEXT_PUBLIC_FIREBASE_* from Firebase Console into .env.local and restart `pnpm dev`.",
      );
      setPending(false);
      return;
    }
    const auth = getFirebaseAuth();
    // Default scopes only — extra setCustomParameters / scopes can trigger auth/argument-error.
    const provider = new GoogleAuthProvider();

    try {
      // Popup is the Firebase-recommended flow (works on localhost and in browsers
      // that block third-party storage, where signInWithRedirect can fail silently).
      const result = await signInWithPopup(auth, provider);
      if (result?.user) {
        router.replace(next);
        return;
      }
    } catch (err: unknown) {
      const code = authErrorCode(err);
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setError(googleSignInMessage(err));
        setPending(false);
        return;
      }
      if (code === "auth/popup-blocked") {
        // Browser blocked the popup — fall through to redirect below.
      } else {
        setError(googleSignInMessage(err));
        setPending(false);
        return;
      }
    }

    try {
      try {
        sessionStorage.setItem(GOOGLE_REDIRECT_NEXT_KEY, next);
      } catch {
        /* ignore */
      }
      await signInWithRedirect(auth, provider);
    } catch (err: unknown) {
      try {
        sessionStorage.removeItem(GOOGLE_REDIRECT_NEXT_KEY);
      } catch {
        /* ignore */
      }
      setError(googleSignInMessage(err));
      setPending(false);
    }
  }

  const headline = mode === "signin" ? "Welcome back" : "Create your account";
  const subline =
    mode === "signin"
      ? "Sign in to book services and manage your dashboard."
      : "Join in seconds—same login for booking and your customer area.";

  /** Form stack width: full padding from shell; inner caps keep line length sane until the split layout. */
  const formShellClass = cn(
    "relative z-10 flex w-full min-w-0 flex-1 flex-col justify-start overflow-y-auto overscroll-y-contain",
    "min-h-0 py-6 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-[max(0.5rem,env(safe-area-inset-top,0px))]",
    "pl-[max(1rem,env(safe-area-inset-left,0px))] pr-[max(1rem,env(safe-area-inset-right,0px))]",
    "sm:px-6 md:px-8 md:py-8",
    "lg:max-h-none lg:min-h-screen lg:flex-none lg:justify-center lg:overflow-visible lg:w-full lg:max-w-none lg:py-10 lg:px-8 xl:px-10 2xl:px-12",
  );

  const formInnerClass = cn(
    "mx-auto w-full min-w-0",
    /* phone: use full width inside shell */
    "max-w-full",
    /* large phones / small tablets */
    "sm:max-w-2xl",
    /* tablets: room for iPad widths without touching 1024 split */
    "md:max-w-4xl",
    /* split layout: consume the right grid track */
    "lg:mx-0 lg:max-w-none",
  );

  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden bg-slate-50 lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)] lg:flex-none xl:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)]">
      {/* Soft background orbs */}
      <div
        className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-secondary-container/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      {/* Brand column — desktop */}
      <aside
        className={cn(
          "relative hidden min-h-0 min-w-0 w-full flex-col justify-between gap-10 overflow-hidden border-r border-white/10",
          "bg-linear-to-br from-slate-900 via-slate-900 to-primary p-8 text-white sm:p-10 lg:flex lg:gap-12 lg:px-10 lg:py-12 xl:px-14 xl:py-14 2xl:px-16 2xl:py-16",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(64_194_253/0.18),transparent_55%)]"
          aria-hidden
        />
        <Link
          href="/"
          className={cn(
            "group relative z-10 inline-flex w-fit items-center gap-3 rounded-2xl outline-offset-4 transition",
            /* Brand column is lg+ only — keep a solid white logo pill on desktop */
            "bg-white px-3 py-2 text-slate-800 shadow-sm ring-1 ring-slate-200/90",
            "hover:bg-white hover:shadow-md hover:ring-slate-300/90",
            "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary/35",
          )}
          aria-label="Gutter Cleaner — back to homepage"
        >
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50",
              "ring-1 ring-slate-200/80 shadow-sm transition duration-300",
              "group-hover:scale-[1.03] group-hover:bg-white group-hover:ring-slate-300/80",
            )}
          >
            <Image
              src="/gutter-logo.png"
              alt=""
              width={36}
              height={36}
              priority
              className="h-9 w-9"
            />
          </span>
          <span className="font-heading pr-1 text-lg font-bold tracking-tight text-slate-800">
            Gutter Cleaner
          </span>
        </Link>

        <div className="relative z-10 w-full min-w-0 max-w-none space-y-5 wrap-break-word">
          <p className="inline-flex w-fit max-w-full flex-wrap items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 ring-1 ring-white/15">
            <Sparkles className="size-3.5 shrink-0 text-secondary-container" aria-hidden />
            Premium home care
          </p>
          <h2 className="text-balance wrap-break-word font-heading text-3xl font-extrabold leading-[1.12] tracking-tight sm:text-4xl xl:text-[2.75rem] xl:leading-[1.1] 2xl:text-5xl">
            Book online. Track every visit. One login.
          </h2>
          <p className="w-full min-w-0 max-w-none text-pretty text-base leading-relaxed text-white/70 sm:text-lg">
            Gutter cleaning, roof care, and inspections—clear quotes and documented results.
          </p>
        </div>

        <p className="relative z-10 w-full min-w-0 text-sm text-white/45">
          © {new Date().getFullYear()} Gutter Cleaner
        </p>
      </aside>

      {/* Form column — width: formShellClass + formInnerClass; see formInnerClass for breakpoints */}
      <div className={formShellClass}>
        <div className={formInnerClass}>
          {/* Logo when brand column is hidden (below lg) */}
          <div className="mb-6 flex justify-center sm:mb-8 lg:hidden">
            <Link
              href="/"
              className="group inline-flex flex-col items-center gap-2 rounded-2xl p-2 outline-offset-4 transition hover:bg-slate-100/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary/40"
              aria-label="Gutter Cleaner — back to homepage"
            >
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-900/10",
                  "ring-1 ring-slate-200/80 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-xl",
                )}
              >
                <Image
                  src="/gutter-logo.png"
                  alt=""
                  width={40}
                  height={40}
                  priority
                  className="h-10 w-10"
                />
              </span>
              <span className="font-heading text-sm font-bold text-slate-800">Gutter Cleaner</span>
            </Link>
          </div>

          <header className="mb-4 text-center sm:mb-6 md:mb-8 lg:text-left">
            <h1 className="font-heading text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl sm:tracking-tight md:text-4xl lg:text-[2.5rem] lg:leading-tight">
              {headline}
            </h1>
            <p
              className={cn(
                "mt-2 w-full text-pretty text-sm leading-relaxed text-slate-600 sm:text-base md:mx-auto md:max-w-none md:text-lg",
                "max-w-prose sm:mx-auto lg:mx-0 lg:max-w-prose lg:text-base",
              )}
            >
              {subline}
            </p>
          </header>

          <div
            className={cn(
              "w-full space-y-4 rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-xl shadow-slate-900/6 backdrop-blur-xl sm:space-y-5 sm:rounded-3xl sm:p-6 sm:shadow-2xl md:p-8 lg:p-9",
              "ring-1 ring-slate-900/4",
            )}
          >
            <button
              type="button"
              onClick={onGoogle}
              disabled={pending}
              className={cn(
                "flex min-h-12 w-full touch-manipulation items-center justify-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-3.5 sm:gap-3 sm:px-5",
                "font-heading text-sm font-semibold text-slate-800 shadow-sm sm:text-[15px]",
                "transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/90 hover:shadow-md active:scale-[0.99]",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {pending ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                  <span>Signing in…</span>
                </>
              ) : (
                <>
                  <svg className="h-[22px] w-[22px] shrink-0" viewBox="0 0 24 24" aria-hidden>
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-center leading-snug">Continue with Google</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] leading-relaxed text-slate-500 sm:text-xs">
              A Google window may open. Allow popups for this site if your browser blocks them.
            </p>

            {error ? (
              <div
                className="flex gap-3 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3.5 backdrop-blur-sm"
                role="alert"
              >
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="min-w-0 wrap-break-word text-sm font-medium leading-snug text-red-900">
                  {error}
                </p>
              </div>
            ) : null}

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white/90 px-3 font-body text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Or email
                </span>
              </div>
            </div>

            <div
              className="flex gap-1 rounded-2xl bg-slate-100/90 p-1 ring-1 ring-slate-200/60"
              role="tablist"
              aria-label="Account mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signin"}
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className={cn(
                  "flex min-h-12 flex-1 touch-manipulation items-center justify-center rounded-xl px-3 py-3 font-heading text-sm font-semibold transition-all duration-200 lg:min-h-10 lg:py-2.5",
                  mode === "signin"
                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-200/80"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                Sign in
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "signup"}
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className={cn(
                  "flex min-h-12 flex-1 touch-manipulation items-center justify-center rounded-xl px-3 py-3 font-heading text-sm font-semibold transition-all duration-200 lg:min-h-10 lg:py-2.5",
                  mode === "signup"
                    ? "bg-white text-primary shadow-sm ring-1 ring-slate-200/80"
                    : "text-slate-600 hover:text-slate-900",
                )}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={onEmailSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-bold uppercase tracking-wide text-slate-600"
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  disabled={pending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "min-h-12 w-full rounded-xl border border-slate-200/90 bg-slate-50/50 px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400",
                    "transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold uppercase tracking-wide text-slate-600"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={pending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "min-h-12 w-full rounded-xl border border-slate-200/90 bg-slate-50/50 px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400",
                    "transition-all duration-200 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/15",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                  )}
                />
                {mode === "signup" ? (
                  <p className="text-xs text-slate-500">At least 6 characters.</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={pending || !email || !password}
                className={cn(
                  "min-h-12 w-full touch-manipulation rounded-xl bg-primary py-3 font-heading text-base font-bold text-white shadow-lg shadow-primary/25",
                  "transition-all duration-200 hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.99]",
                  "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
                )}
              >
                {pending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    {mode === "signup" ? "Creating…" : "Signing in…"}
                  </span>
                ) : mode === "signup" ? (
                  "Create account"
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 flex justify-center pb-2 sm:mt-8 lg:justify-start">
            <Link
              href="/"
              className="inline-flex min-h-11 touch-manipulation items-center gap-2 rounded-xl px-3 py-2 font-heading text-sm font-semibold text-primary transition-colors hover:bg-primary/5 hover:text-primary"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
