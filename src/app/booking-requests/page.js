"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiFlag, FiX } from "react-icons/fi";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import BookingCard from "@/components/BookingCard";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import { ListSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";

function Requests() {
  const { data, loading, error, reload, setData } = useApi("/bookings/requests");
  const [target, setTarget] = useState(null);
  const [busyId, setBusyId] = useState("");

  const update = async (b, status) => {
    setBusyId(b._id);
    try {
      await api(`/bookings/${b._id}/status`, { method: "PATCH", body: { status } });
      setData((d) => ({ ...d, bookings: d.bookings.map((x) => (x._id === b._id ? { ...x, status } : x)) }));
      toast.success(status === "Confirmed" ? "Booking confirmed. That slot is now blocked for others." : `Booking ${status.toLowerCase()}.`);
      setTarget(null);
    } catch (e) {
      toast.error(e.message); // e.g. 409 when the slot clashes with another confirmed booking
    } finally {
      setBusyId("");
    }
  };

  return (
    <>
      <PageHeader title="Booking requests" subtitle="Creators who asked to book your studios. Confirm a request to lock in the slot." />
      <div className="container-x py-10">
        {loading ? <ListSkeleton /> : error ? (
          <EmptyState title="We could not load your requests" text={error} actionLabel="Try again" onAction={reload} />
        ) : data.bookings.length === 0 ? (
          <EmptyState title="No booking requests yet" text="When someone books one of your studios, it shows up here." actionHref="/add-studio" actionLabel="Add another studio" />
        ) : (
          <div className="space-y-5">
            {data.bookings.map((b) => (
              <BookingCard key={b._id} b={b} who={`Requested by ${b.userName} (${b.userEmail})`} actions={<>
                {b.status === "Pending" && <>
                  <button disabled={busyId === b._id} onClick={() => update(b, "Confirmed")} className="btn btn-success btn-sm rounded-full"><FiCheck />Confirm</button>
                  <button disabled={busyId === b._id} onClick={() => setTarget(b)} className="btn btn-error btn-outline btn-sm rounded-full"><FiX />Decline</button>
                </>}
                {b.status === "Confirmed" && <>
                  <button disabled={busyId === b._id} onClick={() => update(b, "Completed")} className="btn btn-info btn-sm rounded-full"><FiFlag />Mark completed</button>
                  <button disabled={busyId === b._id} onClick={() => setTarget(b)} className="btn btn-error btn-outline btn-sm rounded-full"><FiX />Cancel</button>
                </>}
              </>} />
            ))}
          </div>
        )}
      </div>
      <ConfirmModal open={!!target} onClose={() => setTarget(null)} onConfirm={() => update(target, "Cancelled")} busy={!!busyId} danger title="Cancel this booking?"
        message={`${target?.userName} will see this booking as cancelled.`} confirmLabel="Yes, cancel it" cancelLabel="Go back" />
    </>
  );
}

export default function BookingRequestsPage() {
  return <PrivateRoute><Requests /></PrivateRoute>;
}
