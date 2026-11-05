"use client";
import Link from "next/link";
import { FiSearch, FiClock, FiCheckCircle, FiVideo, FiShield, FiUserCheck, FiTool, FiHeadphones, FiArrowRight } from "react-icons/fi";
import HeroSlider from "@/components/HeroSlider";
import SectionHeading from "@/components/SectionHeading";
import StudioCard from "@/components/StudioCard";
import CategoryIcon from "@/components/CategoryIcon";
import EmptyState from "@/components/EmptyState";
import { CardGridSkeleton } from "@/components/Skeletons";
import { CATEGORIES } from "@/lib/constants";
import { useApi } from "@/lib/useApi";

const steps = [
  { icon: FiSearch, title: "Discover Spaces", text: "Filter by category, price and city, then compare photos, amenities and reviews." },
  { icon: FiClock, title: "Select Shoot Hours", text: "Pick a date and your start and end time. You see confirmed slots before you choose." },
  { icon: FiCheckCircle, title: "Book Instantly", text: "Send a request with a clear price breakdown. The host confirms it from their dashboard." },
  { icon: FiVideo, title: "Create & Produce", text: "Show up, set up and shoot. Leave a review so the next creator knows what to expect." },
];

const guarantees = [
  { icon: FiShield, title: "Liability protection", text: "Every confirmed booking is backed by a clear security deposit and agreed hours." },
  { icon: FiUserCheck, title: "Verified profiles", text: "Hosts and creators sign in with verified accounts, so you know who is on the other side." },
  { icon: FiTool, title: "Equipment safety", text: "Hosts list the gear included in each space, so there are no surprises on shoot day." },
  { icon: FiHeadphones, title: "24/7 host support", text: "Questions at midnight before a big shoot? Our support team answers around the clock." },
];

export default function HomePage() {
  const featured = useApi("/studios?featured=true");
  const stats = useApi("/studios/stats/categories");
  const counts = stats.data?.counts || {};

  return (
    <>
      <HeroSlider />

      <section className="section-pad">
        <div className="container-x">
          <SectionHeading
            title="Featured studios"
            subtitle="Six of our highest-rated spaces right now, ready to book."
            action={<Link href="/studios" className="btn btn-outline rounded-full">See all studios <FiArrowRight /></Link>}
          />
          {featured.loading ? (
            <CardGridSkeleton count={6} />
          ) : featured.error ? (
            <EmptyState title="We could not load the studios" text={featured.error} actionLabel="Try again" onAction={featured.reload} />
          ) : featured.data.studios.length === 0 ? (
            <EmptyState title="No studios listed yet" text="Be the first to list a space on StudioSpace." actionHref="/add-studio" actionLabel="List your studio" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.data.studios.map((s) => <StudioCard key={s._id} studio={s} />)}
            </div>
          )}
        </div>
      </section>

      <section className="section-pad bg-base-200/60">
        <div className="container-x">
          <SectionHeading title="Browse by studio category" subtitle="Jump straight to the kind of space your project needs." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CATEGORIES.map((c) => (
              <Link key={c.value} href={`/studios?category=${encodeURIComponent(c.value)}`}
                className="group flex h-full flex-col rounded-2xl border border-base-300 bg-base-100 p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg">
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-content"><CategoryIcon name={c.icon} /></span>
                <h3 className="font-display text-xl font-bold">{c.label}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-base-content/70">{c.blurb}</p>
                <p className="mt-4 flex items-center justify-between text-sm font-semibold text-primary">
                  {counts[c.value] ? `${counts[c.value]} space${counts[c.value] > 1 ? "s" : ""}` : "Browse"}
                  <FiArrowRight className="transition group-hover:translate-x-1" />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          <SectionHeading title="How booking works" subtitle="From first search to the first take, in four steps." />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="relative h-full rounded-2xl border border-base-300 p-6">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-base-300">{i + 1}</span>
                <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-content"><Icon className="h-6 w-6" /></span>
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-base-content/70">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-pad bg-neutral text-neutral-content">
        <div className="container-x">
          <SectionHeading title="Host guarantee & creator support" subtitle="Rent and host with confidence. These protections come with every booking." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map(({ icon: Icon, title, text }) => (
              <div key={title} className="h-full rounded-2xl border border-neutral-content/15 bg-neutral-content/5 p-6">
                <Icon className="mb-4 h-8 w-8 text-accent" />
                <h3 className="font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-content/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-x">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary p-8 text-primary-content sm:p-12 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Got an empty room? Put it to work.</h2>
              <p className="mt-3 max-w-xl text-primary-content/80">List your studio in about five minutes, set your own hourly rate and approve every booking yourself.</p>
            </div>
            <Link href="/add-studio" className="btn btn-lg rounded-full border-0 bg-accent text-accent-content hover:brightness-95">Host Your Space</Link>
          </div>
        </div>
      </section>
    </>
  );
}
