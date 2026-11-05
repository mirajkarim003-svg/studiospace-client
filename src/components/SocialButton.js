"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function GoogleButton({ redirect = "/" }) {
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try {
      const res = await authClient.signIn.social({ provider: "google", callbackURL: redirect });
      if (res?.error) throw new Error(res.error.message || "Google sign-in is not available right now.");
    } catch (e) {
      toast.error(e.message);
      setBusy(false);
    }
  };
  return (
    <button type="button" onClick={go} disabled={busy} className="btn btn-outline w-full rounded-full">
      {busy ? <span className="loading loading-spinner loading-sm" /> : <FcGoogle className="h-5 w-5" />}
      Continue with Google
    </button>
  );
}
