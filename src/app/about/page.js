import Link from "next/link";
import PageHeader from "@/components/PageHeader";

export const metadata = { title: "About Us" };

const values = [
  ["Creators first", "Every feature starts with one question: does this get someone to a finished shoot faster?"],
  ["Honest pricing", "Hourly rate, deposit and total are shown before you send a request. No surprise fees."],
  ["Hosts in control", "Hosts decide who books and when. Confirmed slots can never be double-booked."],
  ["Spaces for everyone", "From a $25 print workshop to a full sound stage, there is room for every budget and craft."],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About StudioSpace" subtitle="A peer-to-peer marketplace built for people who make things." />
      <div className="container-x py-14">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-5 leading-relaxed text-base-content/80">
            <h2 className="section-title">Rooms should not be the hard part of making work</h2>
            <p>Photographers, filmmakers, podcasters, musicians and artists spend hours calling around for a space that fits their shoot, only to find it is booked or overpriced. At the same time, great studios sit empty between sessions.</p>
            <p>StudioSpace connects the two. Hosts list their rooms with real photos, gear and prices. Creators search, compare and request a slot in minutes. The host confirms, and the calendar updates so nobody gets double-booked.</p>
            <p>We are building the booking layer for the creative economy, one studio at a time.</p>
            <Link href="/studios" className="btn btn-primary rounded-full">Find your studio</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {values.map(([t, d]) => (
              <div key={t} className="h-full rounded-2xl border border-base-300 p-6">
                <h3 className="font-display text-xl font-bold">{t}</h3>
                <p className="mt-2 leading-relaxed text-base-content/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
