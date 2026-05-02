"use client";

import { getFirebaseAuth } from "@/lib/firebase";
import { apiErrorMessage, publicAxios, type ApiEnvelope } from "@/lib/axios";
import type { Auth, User } from "firebase/auth";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppRole = "USER" | "ADMIN";

export type AppUserProfile = {
  id: string;
  email: string;
  displayName: string | null;
  role: AppRole;
};

type AuthState = {
  firebaseUser: User | null;
  profile: AppUserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function fetchMe(token: string): Promise<AppUserProfile> {
  try {
    const { data } = await publicAxios.get<ApiEnvelope<AppUserProfile>>("/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.data;
  } catch (err) {
    throw new Error(apiErrorMessage(err, "Could not load profile"));
  }
}

/** Wait until persisted auth state has been read (avoids a flash of “signed out” on reload). */
function authStateReady(auth: Auth): Promise<void> {
  const ready = (auth as unknown as { authStateReady?: () => Promise<void> }).authStateReady;
  return typeof ready === "function" ? ready.call(auth) : Promise.resolve();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const refreshProfile = useCallback(async () => {
    const auth = getFirebaseAuth();
    const u = auth.currentUser;
    if (!u) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const token = await u.getIdToken();
      const me = await fetchMe(token);
      setProfile(me);
    } catch {
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();

    let unsub: (() => void) | undefined;
    let cancelled = false;

    const start = async () => {
      await authStateReady(auth);
      if (cancelled) return;

      // Firebase docs: onAuthStateChanged(auth, user => { ... })
      unsub = onAuthStateChanged(auth, async (user) => {
        if (cancelled) return;
        setFirebaseUser(user);
        setLoading(false);

        if (!user) {
          setProfile(null);
          setProfileLoading(false);
          return;
        }

        setProfileLoading(true);
        try {
          const token = await user.getIdToken();
          const me = await fetchMe(token);
          if (!cancelled) setProfile(me);
        } catch {
          if (!cancelled) setProfile(null);
        } finally {
          if (!cancelled) setProfileLoading(false);
        }
      });
    };

    void start();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  const getIdToken = useCallback(async () => {
    const auth = getFirebaseAuth();
    const u = auth.currentUser;
    if (!u) return null;
    return u.getIdToken();
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    await firebaseSignOut(auth);
    setFirebaseUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      firebaseUser,
      profile,
      loading,
      profileLoading,
      refreshProfile,
      getIdToken,
      signOut,
    }),
    [firebaseUser, profile, loading, profileLoading, refreshProfile, getIdToken, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
