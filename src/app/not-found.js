import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <svg viewBox="0 0 320 220" className="mb-8 w-72 max-w-full" role="img" aria-label="A clapperboard lying on an empty studio floor">
        <ellipse cx="160" cy="196" rx="120" ry="12" className="fill-base-300" />
        <g transform="rotate(-8 160 110)">
          <rect x="70" y="80" width="180" height="100" rx="8" className="fill-neutral" />
          <rect x="70" y="52" width="180" height="26" rx="6" className="fill-base-content" />
          {[0, 1, 2, 3, 4].map((i) => <polygon key={i} points={`${84 + i * 34},52 ${100 + i * 34},52 ${88 + i * 34},78 ${72 + i * 34},78`} className="fill-accent" />)}
          <text x="160" y="140" textAnchor="middle" fontSize="40" fontWeight="800" className="fill-primary" style={{ fontFamily: "Syne, sans-serif" }}>404</text>
          <rect x="90" y="156" width="140" height="6" rx="3" className="fill-neutral-content" opacity=".5" />
        </g>
      </svg>
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">This scene was cut.</h1>
      <p className="mt-3 max-w-md text-base-content/70">The page you are looking for does not exist or has moved. Let&apos;s get you back to set.</p>
      <Link href="/" className="btn btn-primary mt-8 rounded-full">Return to Home</Link>
    </div>
  );
}
