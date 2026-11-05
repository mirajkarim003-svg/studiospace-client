"use client";
import { FaStar } from "react-icons/fa6";

// Read-only when onChange is not given
export default function StarRating({ value = 0, onChange, size = "h-5 w-5" }) {
  return (
    <div className="flex items-center gap-0.5" role={onChange ? "radiogroup" : "img"} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const star = <FaStar className={`${size} ${n <= Math.round(value) ? "text-accent" : "text-base-300"}`} />;
        return onChange ? (
          <button type="button" key={n} onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} className="rounded p-0.5 transition hover:scale-110">{star}</button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </div>
  );
}
