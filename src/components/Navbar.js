"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiGrid, FiPlusCircle, FiList, FiCalendar, FiInbox, FiHeart, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const MENU = [
  { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/add-studio", label: "Add New Studio", icon: FiPlusCircle },
  { href: "/my-listings", label: "My Studio Listings", icon: FiList },
  { href: "/my-bookings", label: "My Bookings", icon: FiCalendar },
  { href: "/booking-requests", label: "Booking Requests", icon: FiInbox },
  { href: "/wishlist", label: "Saved Studios", icon: FiHeart },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const closeDropdown = () => document.activeElement?.blur();

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur-md">
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined}
              className={`relative px-3 py-2 text-sm font-semibold transition hover:text-primary ${isActive(l.href) ? "text-primary" : "text-base-content/80"}`}>
              {l.label}
              {isActive(l.href) && <span className="absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-accent" />}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {loading ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-base-300" aria-hidden="true" />
          ) : user ? (
            <div className="dropdown dropdown-end dropdown-hover">
              <div tabIndex={0} role="button" className="flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-primary/40 transition hover:ring-primary" aria-label="Open account menu">
                <Avatar src={user.image} name={user.name} size={38} />
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-[60] w-72 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-2xl">
                <li className="pointer-events-none px-3 pb-2 pt-3">
                  <div className="flex flex-col items-start gap-0 p-0 hover:bg-transparent">
                    <span className="text-base font-bold">{user.name}</span>
                    <span className="text-xs text-base-content/60">{user.email}</span>
                  </div>
                </li>
                <div className="my-1 h-px bg-base-300" />
                {MENU.map(({ href, label, icon: Icon }) => (
                  <li key={href}><Link href={href} onClick={closeDropdown} className={isActive(href) ? "active" : ""}><Icon className="h-4 w-4" />{label}</Link></li>
                ))}
                <div className="my-1 h-px bg-base-300" />
                <li><button onClick={() => { closeDropdown(); logout(); }} className="text-error"><FiLogOut className="h-4 w-4" />Logout</button></li>
              </ul>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn btn-ghost rounded-full">Login</Link>
              <Link href="/register" className="btn btn-primary rounded-full">Register</Link>
            </div>
          )}
          <button className="btn btn-ghost btn-circle lg:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-base-300 bg-base-100 lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobile navigation">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className={`rounded-xl px-4 py-3 font-semibold ${isActive(l.href) ? "bg-primary/10 text-primary" : ""}`}>{l.label}</Link>
            ))}
            {!loading && !user && (
              <div className="mt-2 flex gap-3">
                <Link href="/login" className="btn btn-outline flex-1 rounded-full">Login</Link>
                <Link href="/register" className="btn btn-primary flex-1 rounded-full">Register</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
