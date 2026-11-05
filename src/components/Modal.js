"use client";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ open, onClose, title, children, size = "max-w-lg" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 max-h-[92vh] w-full ${size} animate-pop overflow-y-auto rounded-t-3xl bg-base-100 p-6 shadow-2xl sm:rounded-2xl`}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-bold">{title}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle" aria-label="Close dialog">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
