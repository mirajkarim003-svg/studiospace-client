"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [ids, setIds] = useState(new Set());

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setIds(new Set());
      return;
    }
    api("/wishlist/ids").then((r) => setIds(new Set(r.ids))).catch(() => {});
  }, [user?.email, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(
    async (studioId) => {
      if (!user) {
        toast("Log in to save studios to your wishlist", { icon: "🔒" });
        router.push(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      const has = ids.has(studioId);
      const next = new Set(ids);
      has ? next.delete(studioId) : next.add(studioId);
      setIds(next); // update the heart instantly, undo if the server says no
      try {
        await api(`/wishlist/${studioId}`, { method: has ? "DELETE" : "POST" });
        toast.success(has ? "Removed from saved studios" : "Saved to your wishlist");
      } catch (e) {
        setIds(ids);
        toast.error(e.message);
      }
    },
    [ids, user, router]
  );

  return <WishlistContext.Provider value={{ ids, toggle }}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
