import { STATUS_STYLES } from "@/lib/constants";

export default function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_STYLES[status] || "badge-ghost"} badge-lg font-semibold`}>{status}</span>;
}
