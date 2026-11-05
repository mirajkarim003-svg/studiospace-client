"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { exchangeToken } from "@/lib/token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user ?? null;
  const [syncedFor, setSyncedFor] = useState(null);

  // Whenever a user is known (also after a page reload) make sure the Express server has
  // issued the matching HTTPOnly JWT cookie. Private pages wait for this, so a logged-in
  // user is never bounced to /login on reload.
  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setSyncedFor(null);
      return;
    }
    let alive = true;
    exchangeToken()
      .catch(() => {})
      .finally(() => alive && setSyncedFor(user.email));
    return () => {
      alive = false;
    };
  }, [isPending, user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const loading = isPending || (!!user && syncedFor !== user.email);

  const logout = useCallback(async () => {
    try {
      await fetch("/backend/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    router.push("/");
    await authClient.signOut();
    toast.success("Logged out. See you on set!");
  }, [router]);

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
