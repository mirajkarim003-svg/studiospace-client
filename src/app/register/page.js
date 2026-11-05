"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiCheckCircle, FiCircle, FiEye, FiEyeOff } from "react-icons/fi";
import GoogleButton from "@/components/SocialButton";
import PageLoader from "@/components/PageLoader";
import { authClient } from "@/lib/auth-client";
import { isValidUrl } from "@/lib/utils";

const rules = [
  { id: "upper", label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "len", label: "At least 6 characters", test: (p) => p.length >= 6 },
];

function RegisterForm() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect");
  const [form, setForm] = useState({ name: "", email: "", photo: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: "" }); };

  const submit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errs.email = "Please enter a valid email address.";
    if (form.photo.trim() && !isValidUrl(form.photo.trim())) errs.photo = "Photo URL must start with http:// or https://";
    const failed = rules.filter((r) => !r.test(form.password));
    if (failed.length) errs.password = `Password needs: ${failed.map((r) => r.label.toLowerCase()).join(", ")}.`;
    setErrors(errs);
    if (Object.keys(errs).length) return toast.error(Object.values(errs)[0]);

    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.photo.trim() || undefined,
    });
    setBusy(false);
    if (error) {
      const msg = error.message || "We could not create your account.";
      setErrors({ form: msg });
      return toast.error(msg);
    }
    toast.success("Account created! Please log in to continue.");
    router.push(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login");
  };

  return (
    <div className="container-x flex min-h-[calc(100vh-72px)] items-center justify-center py-12">
      <div className="w-full max-w-lg rounded-2xl border border-base-300 bg-base-100 p-8 shadow-xl">
        <h1 className="font-display text-3xl font-extrabold">Create your account</h1>
        <p className="mt-1 text-base-content/70">Book studios, or list your own, in a couple of minutes.</p>
        <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
          <div>
            <label className="field-label" htmlFor="name">Name</label>
            <input id="name" value={form.name} onChange={set("name")} autoComplete="name" className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`} placeholder="Your full name" />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="reg-email">Email</label>
            <input id="reg-email" type="email" value={form.email} onChange={set("email")} autoComplete="email" className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`} placeholder="you@email.com" />
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="photo">Photo URL <span className="font-normal text-base-content/50">(optional)</span></label>
            <input id="photo" value={form.photo} onChange={set("photo")} className={`input input-bordered w-full ${errors.photo ? "input-error" : ""}`} placeholder="https://example.com/me.jpg" />
            {errors.photo && <p className="field-error">{errors.photo}</p>}
          </div>
          <div>
            <label className="field-label" htmlFor="reg-password">Password</label>
            <div className="relative">
              <input id="reg-password" type={show ? "text" : "password"} value={form.password} onChange={set("password")} autoComplete="new-password" className={`input input-bordered w-full pr-12 ${errors.password ? "input-error" : ""}`} placeholder="Create a password" />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-base-content/60" aria-label={show ? "Hide password" : "Show password"}>{show ? <FiEyeOff /> : <FiEye />}</button>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {rules.map((r) => {
                const ok = r.test(form.password);
                return <li key={r.id} className={`flex items-center gap-2 ${ok ? "text-success" : "text-base-content/60"}`}>{ok ? <FiCheckCircle /> : <FiCircle />}{r.label}</li>;
              })}
            </ul>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>
          {errors.form && <p role="alert" className="rounded-xl bg-error/15 p-3 text-sm font-medium text-error">{errors.form}</p>}
          <button className="btn btn-primary w-full rounded-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Register</button>
        </form>
        <div className="divider my-6">or</div>
        <GoogleButton redirect={redirect || "/"} />
        <p className="mt-6 text-center text-sm text-base-content/70">Already have an account? <Link href="/login" className="font-bold text-primary hover:underline">Login</Link></p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <Suspense fallback={<PageLoader />}><RegisterForm /></Suspense>;
}
