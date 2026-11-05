import { ApertureIcon } from "./Logo";

export default function PageLoader({ label = "Loading the studio lights..." }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <span className="animate-spin-slow text-primary"><ApertureIcon className="h-14 w-14" /></span>
      <p className="font-display text-lg font-bold">{label}</p>
    </div>
  );
}
