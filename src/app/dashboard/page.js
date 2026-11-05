"use client";
import Link from "next/link";
import { FiCalendar, FiDollarSign, FiHeart, FiInbox, FiList, FiPlus } from "react-icons/fi";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import { ListSkeleton } from "@/components/Skeletons";
import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/lib/useApi";
import { fmtDate, fmtTime, money } from "@/lib/utils";

function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error, reload } = useApi("/dashboard");

  const stats = data && [
    { label: "Studios you host", value: data.listings, icon: FiList, href: "/my-listings" },
    { label: "Pending requests", value: data.requests.pending, icon: FiInbox, href: "/booking-requests" },
    { label: "Host earnings (confirmed)", value: money(data.requests.earnings), icon: FiDollarSign, href: "/booking-requests" },
    { label: "Your bookings", value: data.myBookings.total, icon: FiCalendar, href: "/my-bookings" },
    { label: "Saved studios", value: data.wishlist, icon: FiHeart, href: "/wishlist" },
  ];

  return (
    <>
      <PageHeader title={`Hello, ${user.name.split(" ")[0]}`} subtitle="Your studio activity at a glance.">
        <Link href="/add-studio" className="btn btn-primary rounded-full"><FiPlus />Add New Studio</Link>
      </PageHeader>
      <div className="container-x py-10">
        {loading ? <ListSkeleton rows={3} /> : error ? (
          <EmptyState title="We could not load your dashboard" text={error} actionLabel="Try again" onAction={reload} />
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {stats.map(({ label, value, icon: Icon, href }) => (
                <Link key={label} href={href} className="rounded-2xl border border-base-300 bg-base-100 p-5 transition hover:border-primary hover:shadow-lg">
                  <Icon className="mb-3 h-6 w-6 text-primary" />
                  <p className="text-3xl font-extrabold">{value}</p>
                  <p className="mt-1 text-sm text-base-content/70">{label}</p>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                <span key={s} className="rounded-full bg-base-200 px-4 py-2 font-semibold capitalize">{data.myBookings[s]} {s}</span>
              ))}
            </div>

            <h2 className="mb-5 mt-12 font-display text-2xl font-bold">Recent bookings</h2>
            {data.recent.length === 0 ? (
              <EmptyState title="No bookings yet" text="Your latest bookings will appear here." actionHref="/studios" actionLabel="Explore studios" />
            ) : (
              <ul className="divide-y divide-base-300 rounded-2xl border border-base-300">
                {data.recent.map((b) => (
                  <li key={b._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div>
                      <Link href={`/studios/${b.studioId}`} className="font-bold hover:text-primary">{b.studioTitle}</Link>
                      <p className="text-sm text-base-content/70">{fmtDate(b.date)}, {fmtTime(b.startTime)} - {fmtTime(b.endTime)}</p>
                    </div>
                    <div className="flex items-center gap-4"><span className="font-bold">{money(b.total)}</span><StatusBadge status={b.status} /></div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default function DashboardPage() {
  return <PrivateRoute><Dashboard /></PrivateRoute>;
}
