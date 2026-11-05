export const money = (n) => {
  const v = Number(n || 0);
  return `$${v.toLocaleString("en-US", { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })}`;
};

export const fmtDate = (d) => {
  if (!d) return "";
  return new Date(`${d}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};

export const fmtTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export const toMinutes = (t) => {
  const [h, m] = (t || "0:0").split(":").map(Number);
  return h * 60 + m;
};

// Today's date in the visitor's own time zone, as YYYY-MM-DD
export const todayStr = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

// 06:00, 06:30 ... 23:30
export const TIME_OPTIONS = Array.from({ length: 36 }, (_, i) => {
  const mins = 360 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

export const isValidUrl = (u) => {
  try {
    const x = new URL(u);
    return x.protocol === "http:" || x.protocol === "https:";
  } catch {
    return false;
  }
};

export const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("") || "S";
