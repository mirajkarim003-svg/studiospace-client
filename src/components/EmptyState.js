import Link from "next/link";
import { ApertureIcon } from "./Logo";

export default function EmptyState({ title, text, actionHref, actionLabel, onAction, icon }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-base-300 bg-base-200/50 px-6 py-14 text-center">
      <span className="mb-4 text-primary">{icon || <ApertureIcon className="h-14 w-14" />}</span>
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      {text && <p className="mt-2 text-base-content/70">{text}</p>}
      {actionHref && <Link href={actionHref} className="btn btn-primary mt-6 rounded-full">{actionLabel}</Link>}
      {onAction && <button onClick={onAction} className="btn btn-primary mt-6 rounded-full">{actionLabel}</button>}
    </div>
  );
}
