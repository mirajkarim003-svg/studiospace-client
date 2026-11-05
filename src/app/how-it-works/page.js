import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "How It Works" };

const guestSteps = [
  ["Discover Spaces", "Browse studios by category, price and rating. Every listing shows photos, amenities, the hourly rate, the deposit and the host."],
  ["Select Shoot Hours", "Open a studio, choose a date and your start and end time. Slots that are already confirmed are shown before you submit."],
  ["Book Instantly", "Send your request with a live price breakdown. It appears in My Bookings as Pending until the host responds."],
  ["Create & Produce", "Once confirmed, download your PDF receipt, show up and shoot. Leave a review afterwards."],
];
const hostSteps = [
  ["List your space", "Add photos, amenities, your hourly rate, a security deposit and a maximum capacity."],
  ["Review requests", "Booking requests land in your Booking Requests page. Confirm the ones that fit, decline the rest."],
  ["Stay in control", "Confirmed slots are blocked automatically, so double bookings cannot happen."],
];
const faqs = [
  ["Do I need an account to browse?", "No. You can explore every studio without logging in. You only need an account to book, save or list a studio."],
  ["What is the security deposit?", "A refundable amount set by the host to cover damage. It is shown separately in every price breakdown."],
  ["Can I cancel a booking?", "Yes. You can cancel any request while it is still Pending. After the host confirms, contact them directly."],
  ["Can two people book the same time?", "Several people can request the same slot, but once the host confirms one booking, overlapping requests can no longer be confirmed."],
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader title="How StudioSpace works" subtitle="Whether you rent a room or rent one out, it takes a few minutes." />
      <div className="container-x py-14">
        <h2 className="section-title mb-8">For creators</h2>
        <ol className="grid gap-5 md:grid-cols-2">
          {guestSteps.map(([t, d], i) => (
            <li key={t} className="flex gap-5 rounded-2xl border border-base-300 p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-extrabold text-primary-content">{i + 1}</span>
              <div><h3 className="font-display text-xl font-bold">{t}</h3><p className="mt-2 leading-relaxed text-base-content/70">{d}</p></div>
            </li>
          ))}
        </ol>

        <h2 className="section-title mb-8 mt-20">For hosts</h2>
        <ol className="grid gap-5 md:grid-cols-3">
          {hostSteps.map(([t, d], i) => (
            <li key={t} className="rounded-2xl bg-base-200 p-6">
              <span className="tape-badge mb-4">Step {i + 1}</span>
              <h3 className="font-display text-xl font-bold">{t}</h3><p className="mt-2 leading-relaxed text-base-content/70">{d}</p>
            </li>
          ))}
        </ol>

        <h2 className="section-title mb-8 mt-20">Questions, answered</h2>
        <div className="max-w-3xl space-y-3">
          {faqs.map(([q, a]) => (
            <div key={q} className="collapse collapse-arrow rounded-2xl border border-base-300">
              <input type="checkbox" aria-label={q} />
              <div className="collapse-title text-lg font-bold">{q}</div>
              <div className="collapse-content text-base-content/70"><p>{a}</p></div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          <Link href="/studios" className="btn btn-primary rounded-full">Explore Studios</Link>
          <Link href="/add-studio" className="btn btn-outline rounded-full">Host Your Space</Link>
        </div>
      </div>
    </>
  );
}
