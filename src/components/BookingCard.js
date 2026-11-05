"use client";
import Link from "next/link";
import { FiCalendar, FiClock, FiMapPin, FiUsers } from "react-icons/fi";
import SafeImg from "./SafeImg";
import StatusBadge from "./StatusBadge";
import { fmtDate, fmtTime, money } from "@/lib/utils";

// Shared by My Bookings (guest view) and Booking Requests (host view)
export default function BookingCard({ b, who, actions }) {
  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm sm:flex-row sm:p-5">
      <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-base-300 sm:h-auto sm:w-48">
        <SafeImg src={b.studioImage} alt={b.studioTitle} category={b.studioCategory} className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link href={`/studios/${b.studioId}`} className="font-display text-xl font-bold hover:text-primary">{b.studioTitle}</Link>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-base-content/70"><FiMapPin className="shrink-0" />{b.studioLocation}</p>
          </div>
          <StatusBadge status={b.status} />
        </div>
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <p className="flex items-center gap-2"><FiCalendar className="text-primary" />{fmtDate(b.date)}</p>
          <p className="flex items-center gap-2"><FiClock className="text-primary" />{fmtTime(b.startTime)} - {fmtTime(b.endTime)} ({b.hours} hr)</p>
          <p className="flex items-center gap-2"><FiUsers className="text-primary" />{b.guests} guest{b.guests > 1 ? "s" : ""}</p>
          <p className="font-bold">Total {money(b.total)} <span className="font-normal text-base-content/60">(incl. {money(b.securityDeposit)} deposit)</span></p>
        </div>
        {who && <p className="text-sm text-base-content/70">{who}</p>}
        {b.notes && <p className="rounded-lg bg-base-200 p-3 text-sm italic">&ldquo;{b.notes}&rdquo;</p>}
        {b.cancelReason && <p className="text-sm text-error">{b.cancelReason}</p>}
        {actions && <div className="mt-auto flex flex-wrap gap-2 pt-2">{actions}</div>}
      </div>
    </article>
  );
}
