"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Modal from "./Modal";
import { api } from "@/lib/api";
import { TIME_OPTIONS, fmtTime, money, toMinutes, todayStr } from "@/lib/utils";

export default function BookingModal({ open, onClose, studio }) {
  const router = useRouter();
  const [form, setForm] = useState({ date: "", startTime: "10:00", endTime: "12:00", guests: 1, notes: "" });
  const [booked, setBooked] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) setForm((f) => ({ ...f, date: f.date || todayStr() }));
  }, [open]);

  // Show the already confirmed slots for the chosen date
  useEffect(() => {
    if (!open || !form.date) return;
    let alive = true;
    api(`/bookings/availability?studioId=${studio._id}&date=${form.date}`)
      .then((r) => alive && setBooked(r.booked))
      .catch(() => alive && setBooked([]));
    return () => { alive = false; };
  }, [open, form.date, studio._id]);

  const set = (k) => (e) => { setError(""); setForm((f) => ({ ...f, [k]: e.target.value })); };
  const s = toMinutes(form.startTime);
  const e = toMinutes(form.endTime);
  const hours = (e - s) / 60;
  const validTime = hours >= 1 && hours <= 12;
  const subtotal = validTime ? studio.hourlyRate * hours : 0;
  const total = subtotal + (studio.securityDeposit || 0);
  const clash = booked.find((b) => s < toMinutes(b.endTime) && e > toMinutes(b.startTime));

  const submit = async (ev) => {
    ev.preventDefault();
    if (!form.date || form.date < todayStr()) return setError("Please choose today or a future date.");
    if (!validTime) return setError("Bookings must be between 1 and 12 hours, and the end time must be after the start time.");
    const guests = Number(form.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > studio.maxCapacity) return setError(`Guests must be between 1 and ${studio.maxCapacity}.`);
    setBusy(true);
    setError("");
    try {
      await api("/bookings", { method: "POST", body: { studioId: studio._id, ...form, guests } });
      toast.success("Booking request sent! The host will confirm it soon.");
      onClose();
      router.push("/my-bookings");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`Book ${studio.title}`} size="max-w-xl">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="b-date">Date</label>
          <input id="b-date" type="date" min={todayStr()} value={form.date} onChange={set("date")} required className="input input-bordered w-full" />
          {form.date && (
            <p className="mt-2 text-sm text-base-content/70">
              {booked.length ? (
                <>Already confirmed that day: {booked.map((b) => <span key={b.startTime} className="mr-2 inline-block rounded-md bg-error/15 px-2 py-0.5 font-semibold text-error">{fmtTime(b.startTime)} to {fmtTime(b.endTime)}</span>)}</>
              ) : "No confirmed bookings on this date yet."}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label" htmlFor="b-start">Start time</label>
            <select id="b-start" value={form.startTime} onChange={set("startTime")} className="select select-bordered w-full">{TIME_OPTIONS.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</select>
          </div>
          <div>
            <label className="field-label" htmlFor="b-end">End time</label>
            <select id="b-end" value={form.endTime} onChange={set("endTime")} className="select select-bordered w-full">{TIME_OPTIONS.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}</select>
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="b-guests">Guests (max {studio.maxCapacity})</label>
          <input id="b-guests" type="number" min="1" max={studio.maxCapacity} value={form.guests} onChange={set("guests")} className="input input-bordered w-full" />
        </div>
        <div>
          <label className="field-label" htmlFor="b-notes">Note to the host (optional)</label>
          <textarea id="b-notes" rows={2} maxLength={500} value={form.notes} onChange={set("notes")} placeholder="Tell the host what you are shooting and what gear you will bring." className="textarea textarea-bordered w-full" />
        </div>

        {clash && <p className="rounded-xl bg-warning/15 p-3 text-sm font-medium">Heads up: this overlaps a confirmed booking ({fmtTime(clash.startTime)} to {fmtTime(clash.endTime)}). The server will reject it, so pick another time.</p>}
        {error && <p role="alert" className="rounded-xl bg-error/15 p-3 text-sm font-medium text-error">{error}</p>}

        <div className="rounded-xl bg-base-200 p-4 text-sm">
          <div className="flex justify-between"><span>{money(studio.hourlyRate)} x {validTime ? hours : 0} hr</span><span>{money(subtotal)}</span></div>
          <div className="mt-1 flex justify-between"><span>Security deposit (refundable)</span><span>{money(studio.securityDeposit || 0)}</span></div>
          <div className="mt-3 flex justify-between border-t border-base-300 pt-3 text-base font-bold"><span>Total due</span><span>{money(total)}</span></div>
        </div>

        <button className="btn btn-primary w-full rounded-full" disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />}Send booking request
        </button>
      </form>
    </Modal>
  );
}
