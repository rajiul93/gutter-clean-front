import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import {
  type Auth,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  getAuth,
  initializeAuth,
} from "firebase/auth";

function trim(s: string | undefined): string | undefined {
  const t = s?.trim();
  return t || undefined;
}

/**
 * `auth/argument-error` often comes from a bad `authDomain` (e.g. `https://` prefix)
 * or from passing `undefined` into `initializeApp`. Normalize and default from projectId.
 */
function normalizeAuthDomain(raw: string | undefined, projectId: string): string {
  let d = trim(raw) ?? `${projectId}.firebaseapp.com`;
  d = d.replace(/^https?:\/\//i, "");
  d = d.replace(/\/$/, "");
  return d;
}

function buildFirebaseOptions(): FirebaseOptions {
  const apiKey = trim(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  const projectId = trim(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  if (!apiKey || !projectId) {
    throw new Error(
      "Missing Firebase web config. Set NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID (and ideally NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN).",
    );
  }

  const authDomain = normalizeAuthDomain(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, projectId);

  const opts: FirebaseOptions = {
    apiKey,
    authDomain,
    projectId,
  };

  const storageBucket = trim(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  const messagingSenderId = trim(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  const appId = trim(process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

  if (storageBucket) opts.storageBucket = storageBucket;
  if (messagingSenderId) opts.messagingSenderId = messagingSenderId;
  if (appId) opts.appId = appId;

  return opts;
}

function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    return initializeApp(buildFirebaseOptions());
  }
  return getApp();
}

/** Single browser Auth instance with explicit local persistence (survives reload). */
let browserAuth: Auth | null = null;

/**
 * Firebase Auth for the browser. Uses `initializeAuth` + `browserLocalPersistence`
 * so the session is restored after full page reload (recommended for Next.js).
 * On the server returns `getAuth` (no persistence; do not rely on it for user state).
 */
export function getFirebaseAuth(): Auth {
  const app = getFirebaseApp();
  if (typeof window === "undefined") {
    return getAuth(app);
  }
  if (browserAuth) return browserAuth;
  try {
    // Required for signInWithPopup / signInWithRedirect — without it Firebase throws auth/argument-error.
    browserAuth = initializeAuth(app, {
      persistence: browserLocalPersistence,
      popupRedirectResolver: browserPopupRedirectResolver,
    });
  } catch {
    browserAuth = getAuth(app);
  }
  return browserAuth;
}
