"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FaXTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa6";
import Logo from "./Logo";
import { CATEGORIES } from "@/lib/constants";
import { api } from "@/lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const subscribe = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await api("/newsletter", { method: "POST", body: { email } });
      toast.success(r.message);
      setEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const social = [
    { href: "https://x.com", label: "StudioSpace on X", Icon: FaXTwitter },
    { href: "https://www.instagram.com", label: "StudioSpace on Instagram", Icon: FaInstagram },
    { href: "https://www.youtube.com", label: "StudioSpace on YouTube", Icon: FaYoutube },
    { href: "https://www.linkedin.com", label: "StudioSpace on LinkedIn", Icon: FaLinkedinIn },
  ];

  return (
    <footer className="mt-24 bg-neutral text-neutral-content">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="[&_a]:text-neutral-content"><Logo /></div>
          <p className="mt-4 max-w-xs leading-relaxed text-neutral-content/70">
            Our mission: make every great studio in town bookable in minutes, so creators spend their time making work instead of hunting for rooms.
          </p>
          <div className="mt-6 flex gap-3">
            {social.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-content/25 transition hover:border-accent hover:text-accent">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg font-bold">Quick links</h4>
          <ul className="space-y-2.5 text-neutral-content/70">
            {[["/", "Home"], ["/studios", "Explore Studios"], ["/how-it-works", "How It Works"], ["/about", "About Us"], ["/add-studio", "Host Your Space"]].map(([href, label]) => (
              <li key={href}><Link href={href} className="transition hover:text-accent">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg font-bold">Popular categories</h4>
          <ul className="space-y-2.5 text-neutral-content/70">
            {CATEGORIES.map((c) => (
              <li key={c.value}><Link href={`/studios?category=${encodeURIComponent(c.value)}`} className="transition hover:text-accent">{c.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg font-bold">Studio drops in your inbox</h4>
          <p className="mb-4 text-neutral-content/70">New listings and booking tips, once a month.</p>
          <form onSubmit={subscribe} className="flex gap-2">
            <label htmlFor="newsletter" className="sr-only">Email address</label>
            <input id="newsletter" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
              className="input input-bordered w-full min-w-0 rounded-full bg-neutral-content/10 text-neutral-content placeholder:text-neutral-content/50" />
            <button className="btn btn-accent rounded-full" disabled={busy}>{busy ? <span className="loading loading-spinner loading-sm" /> : "Subscribe"}</button>
          </form>
        </div>
      </div>
      <div className="border-t border-neutral-content/15">
        <div className="container-x flex flex-col gap-2 py-6 text-sm text-neutral-content/60 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>By using StudioSpace you agree to our Terms of Use and Privacy Policy.</p>
        </div>
      </div>
    </footer>
  );
}
