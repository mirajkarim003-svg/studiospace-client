"use client";
import Modal from "./Modal";

export default function ConfirmModal({ open, title, message, confirmLabel = "Confirm", cancelLabel = "Keep it", danger = false, busy = false, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={title} size="max-w-md">
      <p className="mb-6 leading-relaxed text-base-content/75">{message}</p>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button className="btn btn-ghost rounded-full" onClick={onClose} disabled={busy}>{cancelLabel}</button>
        <button className={`btn rounded-full ${danger ? "btn-error" : "btn-primary"}`} onClick={onConfirm} disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
