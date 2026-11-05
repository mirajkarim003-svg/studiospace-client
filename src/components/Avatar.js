"use client";
import { useState } from "react";
import { initials } from "@/lib/utils";

export default function Avatar({ src, name, size = 40 }) {
  const [bad, setBad] = useState(false);
  const style = { width: size, height: size };
  if (!src || bad) {
    return (
      <span style={{ ...style, fontSize: size * 0.38 }} className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
        {initials(name)}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name || "Profile photo"} style={style} referrerPolicy="no-referrer" onError={() => setBad(true)} className="shrink-0 rounded-full object-cover" />
  );
}
