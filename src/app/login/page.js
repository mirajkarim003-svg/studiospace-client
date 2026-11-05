"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import GoogleButton from "@/components/SocialButton";
import PageLoader from "@/components/PageLoader";
import { ApertureIcon } from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";

const safePath = (p) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/");

function LoginForm() {
  const router = useRouter();
  const redirect = safePath(useSearchParams().get("redirect"));
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Once the session is ready (right after login, or when an already logged-in user opens /login)
  useEffect(() => {
    if (!loading && user) router.replace(redirect);
  }, [loading, user, redirect, router]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    const { error: err } = await authClient.signIn.email({ email: form.email.trim(), password: form.password });
    if (err) {
      const msg = err.message || "Invalid email or password.";
      setError(msg);
      toast.error(msg);
      setBusy(false);
      return;
    }
    toast.success("Welcome back! Lights, camera, action.");
  };

  if (loading || user) return <PageLoader label="Signing you in..." />;

  return (
    <div className="container-x grid min-h-[calc(100vh-72px)] items-center gap-12 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <span className="text-primary"><ApertureIcon className="h-16 w-16" /></span>
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-tight">Welcome back to the studio.</h1>
        <p className="mt-4 max-w-md text-lg text-base-content/70">Log in to manage your bookings, answer booking requests and keep your favorite spaces one tap away.</p>
      </div>

      <div className="mx-auto w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8 shadow-xl">
        <h2 className="font-display text-3xl font-extrabold">Log in</h2>
        <p className="mt-1 text-base-content/70">Use the email you registered with.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input input-bordered w-full" placeholder="you@email.com" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="field-label" htmlFor="password">Password</label>
              <button type="button" onClick={() => toast("Password reset is not enabled in this version of StudioSpace.", { icon: "ℹ️" })} className="mb-1.5 text-sm font-semibold text-primary hover:underline">Forgot password?</button>
            </div>
            <div className="relative">
              <input id="password" type={show ? "text" : "password"} required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input input-bordered w-full pr-12" placeholder="Your password" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-base-content/60" aria-label={show ? "Hide password" : "Show password"}>{show ? <FiEyeOff /> : <FiEye />}</button>
            </div>
          </div>
          {error && <p role="alert" className="rounded-xl bg-error/15 p-3 text-sm font-medium text-error">{error}</p>}
          <button className="btn btn-primary w-full rounded-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Login</button>
        </form>
        <div className="divider my-6">or</div>
        <GoogleButton redirect={redirect} />
        <p className="mt-6 text-center text-sm text-base-content/70">
          New to StudioSpace? <Link href={`/register${redirect !== "/" ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="font-bold text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<PageLoader />}><LoginForm /></Suspense>;
}
