import Link from "next/link";

export function ApertureIcon({ className = "h-8 w-8" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
      <circle cx="24" cy="24" r="21" />
      <polygon points="33,24 28.5,31.8 19.5,31.8 15,24 19.5,16.2 28.5,16.2" />
      <path d="M33 24 L13.5 42.2 M28.5 31.8 L3 24 M19.5 31.8 L13.5 5.8 M15 24 L34.5 5.8 M19.5 16.2 L45 24 M28.5 16.2 L34.5 42.2" />
    </svg>
  );
}

// Same size and style in the navbar and the footer
export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label="StudioSpace home">
      <span className="text-primary"><ApertureIcon className="h-9 w-9" /></span>
      <span className="font-display text-2xl font-extrabold tracking-tight">
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}
