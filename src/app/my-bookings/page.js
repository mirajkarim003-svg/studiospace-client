"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiDownload, FiXCircle } from "react-icons/fi";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import BookingCard from "@/components/BookingCard";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import { ListSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { downloadInvoice } from "@/lib/invoice";
import { useApi } from "@/lib/useApi";

const TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

function Bookings() {
  const { data, loading, error, reload, setData } = useApi("/bookings/mine");
  const [tab, setTab] = useState("All");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const cancel = async () => {
    setBusy(true);
    try {
      await api(`/bookings/${target._id}/status`, { method: "PATCH", body: { status: "Cancelled" } });
      setData((d) => ({ ...d, bookings: d.bookings.map((b) => (b._id === target._id ? { ...b, status: "Cancelled" } : b)) }));
      toast.success("Booking cancelled.");
      setTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const invoice = async (b) => {
    try { await downloadInvoice(b); toast.success("Receipt downloaded"); } catch { toast.error("Could not create the PDF. Please try again."); }
  };

  const list = (data?.bookings || []).filter((b) => tab === "All" || b.status === tab);

  return (
    <>
      <PageHeader title="My bookings" subtitle="Every studio session you have requested, with live status." />
      <div className="container-x py-10">
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter bookings by status">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`btn btn-sm rounded-full ${tab === t ? "btn-primary" : "btn-outline"}`}>
              {t}{data && t !== "All" ? ` (${data.bookings.filter((b) => b.status === t).length})` : ""}
            </button>
          ))}
        </div>
        {loading ? <ListSkeleton /> : error ? (
          <EmptyState title="We could not load your bookings" text={error} actionLabel="Try again" onAction={reload} />
        ) : data.bookings.length === 0 ? (
          <EmptyState title="No bookings yet" text="Find a space for your next shoot, session or class." actionHref="/studios" actionLabel="Explore studios" />
        ) : list.length === 0 ? (
          <EmptyState title={`No ${tab.toLowerCase()} bookings`} text="Try another status tab." actionLabel="Show all" onAction={() => setTab("All")} />
        ) : (
          <div className="space-y-5">
            {list.map((b) => (
              <BookingCard key={b._id} b={b} who={`Hosted by ${b.hostName}`} actions={<>
                {b.status === "Pending" && <button onClick={() => setTarget(b)} className="btn btn-error btn-outline btn-sm rounded-full"><FiXCircle />Cancel Booking</button>}
                {["Confirmed", "Completed"].includes(b.status) && <button onClick={() => invoice(b)} className="btn btn-outline btn-sm rounded-full"><FiDownload />Download receipt (PDF)</button>}
              </>} />
            ))}
          </div>
        )}
      </div>
      <ConfirmModal open={!!target} onClose={() => setTarget(null)} onConfirm={cancel} busy={busy} danger title="Cancel this booking?"
        message={`Your pending request for ${target?.studioTitle} will be cancelled. You can always book again later.`} confirmLabel="Cancel booking" cancelLabel="Keep booking" />
    </>
  );
}

export default function MyBookingsPage() {
  return <PrivateRoute><Bookings /></PrivateRoute>;
}
