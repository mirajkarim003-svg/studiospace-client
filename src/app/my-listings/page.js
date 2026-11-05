"use client";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiEdit2, FiEye, FiPlus, FiTrash2 } from "react-icons/fi";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import SafeImg from "@/components/SafeImg";
import EmptyState from "@/components/EmptyState";
import ConfirmModal from "@/components/ConfirmModal";
import { ListSkeleton } from "@/components/Skeletons";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { money } from "@/lib/utils";

function Listings() {
  const { data, loading, error, reload, setData } = useApi("/studios/mine");
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    setBusy(true);
    try {
      await api(`/studios/${target._id}`, { method: "DELETE" });
      setData((d) => ({ ...d, studios: d.studios.filter((s) => s._id !== target._id) }));
      toast.success(`"${target.title}" was deleted.`);
      setTarget(null);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="My studio listings" subtitle="Spaces you host on StudioSpace.">
        <Link href="/add-studio" className="btn btn-primary rounded-full"><FiPlus />Add New Studio</Link>
      </PageHeader>
      <div className="container-x py-10">
        {loading ? <ListSkeleton /> : error ? (
          <EmptyState title="We could not load your listings" text={error} actionLabel="Try again" onAction={reload} />
        ) : data.studios.length === 0 ? (
          <EmptyState title="You have not listed a studio yet" text="List your first space and start receiving booking requests." actionHref="/add-studio" actionLabel="Add your first studio" />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-base-300">
            <table className="table">
              <thead><tr><th>Studio</th><th>Category</th><th>Rate</th><th>Capacity</th><th>Rating</th><th className="text-right">Actions</th></tr></thead>
              <tbody>
                {data.studios.map((s) => (
                  <tr key={s._id} className="hover">
                    <td>
                      <div className="flex min-w-[240px] items-center gap-3">
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-base-300"><SafeImg src={s.image} alt="" category={s.category} className="h-full w-full object-cover" /></div>
                        <div><p className="font-bold">{s.title}</p><p className="text-xs text-base-content/60">{s.location}</p></div>
                      </div>
                    </td>
                    <td>{s.category}</td>
                    <td className="whitespace-nowrap font-semibold">{money(s.hourlyRate)} / hr</td>
                    <td>{s.maxCapacity}</td>
                    <td>{s.reviewCount ? s.rating.toFixed(1) : "New"}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Link href={`/studios/${s._id}`} className="btn btn-ghost btn-sm btn-circle" aria-label={`View ${s.title}`}><FiEye /></Link>
                        <Link href={`/studios/edit/${s._id}`} className="btn btn-outline btn-sm rounded-full"><FiEdit2 />Update</Link>
                        <button onClick={() => setTarget(s)} className="btn btn-error btn-outline btn-sm rounded-full"><FiTrash2 />Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmModal open={!!target} onClose={() => setTarget(null)} onConfirm={remove} busy={busy} danger title="Delete this studio?"
        message={`"${target?.title}" will be removed for good, along with its reviews. Pending and confirmed bookings for it will be cancelled.`} confirmLabel="Yes, delete it" cancelLabel="Keep listing" />
    </>
  );
}

export default function MyListingsPage() {
  return <PrivateRoute><Listings /></PrivateRoute>;
}
