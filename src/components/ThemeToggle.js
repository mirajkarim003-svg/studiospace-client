"use client";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);
  useEffect(() => setTheme(document.documentElement.getAttribute("data-theme") || "studiolight"), []);

  const toggle = () => {
    const next = theme === "studiodark" ? "studiolight" : "studiodark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("studio-theme", next); } catch {}
    setTheme(next);
  };
  const dark = theme === "studiodark";
  return (
    <button onClick={toggle} className="btn btn-ghost btn-circle" aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Light theme" : "Dark theme"}>
      {dark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
    </button>
  );
}
