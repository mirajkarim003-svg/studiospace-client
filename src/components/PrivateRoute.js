"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageLoader from "./PageLoader";

// Wrap every private page. While the session is still being restored after a reload we show
// the loader (never redirect), and only send guests to /login once we are sure nobody is signed in.
export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
  }, [loading, user, pathname, router]);

  if (loading || !user) return <PageLoader label="Checking your session..." />;
  return children;
}
