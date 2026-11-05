"use client";
import { useEffect, useRef, useState } from "react";

// A good-looking stand-in when an image URL is missing or broken
export function placeholder(category = "Studio") {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#141a33'/><stop offset='1' stop-color='#4a3cf0'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/><g fill='none' stroke='#ffd21f' stroke-width='6' stroke-linejoin='round'><circle cx='400' cy='270' r='96'/><polygon points='400,200 460,235 460,305 400,340 340,305 340,235'/></g><text x='400' y='450' text-anchor='middle' font-family='Arial,sans-serif' font-size='34' fill='#eef1f6'>${category}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function SafeImg({ src, alt = "", category, className, eager = false }) {
  const ref = useRef(null);
  const [bad, setBad] = useState(false);

  useEffect(() => {
    setBad(false);
    const el = ref.current;
    // the image may have failed before React attached onError
    if (el && el.complete && el.naturalWidth === 0 && src) setBad(true);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={bad || !src ? placeholder(category) : src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      onError={() => setBad(true)}
      className={className}
    />
  );
}
