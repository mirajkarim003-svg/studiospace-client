"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import Avatar from "./Avatar";
import StarRating from "./StarRating";
import { api } from "@/lib/api";

export default function Reviews({ studioId, reviews, user, isOwner, onChanged }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please pick a star rating first.");
    setBusy(true);
    try {
      const r = await api(`/studios/${studioId}/reviews`, { method: "POST", body: { rating, comment } });
      toast.success(r.message);
      setRating(0);
      setComment("");
      onChanged();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {reviews.length === 0 ? (
        <p className="rounded-xl bg-base-200 p-5 text-base-content/70">No reviews yet. Be the first to share how your session went.</p>
      ) : (
        <ul className="space-y-5">
          {reviews.map((r) => (
            <li key={r._id} className="flex gap-4 rounded-xl border border-base-300 p-5">
              <Avatar src={r.userPhoto} name={r.userName} size={44} />
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-bold">{r.userName}</span>
                  <StarRating value={r.rating} size="h-4 w-4" />
                  <span className="text-xs text-base-content/50">{new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
                <p className="mt-2 leading-relaxed text-base-content/80">{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {user && !isOwner && (
        <form onSubmit={submit} className="mt-8 rounded-xl border border-base-300 p-5">
          <h4 className="font-display text-lg font-bold">Rate this studio</h4>
          <div className="my-3"><StarRating value={rating} onChange={setRating} size="h-7 w-7" /></div>
          <label htmlFor="review" className="sr-only">Your review</label>
          <textarea id="review" required minLength={5} maxLength={500} rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What stood out? Light, sound, space, host..." className="textarea textarea-bordered w-full" />
          <button className="btn btn-primary mt-3 rounded-full" disabled={busy}>{busy && <span className="loading loading-spinner loading-sm" />}Post review</button>
        </form>
      )}
    </div>
  );
}
