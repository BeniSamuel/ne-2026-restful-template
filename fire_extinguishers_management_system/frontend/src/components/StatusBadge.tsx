const styles: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  SCHEDULED: "bg-blue-100 text-blue-700",
  PASSED: "bg-emerald-100 text-emerald-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-red-100 text-red-700",
  EXPIRED: "bg-red-100 text-red-700",
  UNDER_MAINTENANCE: "bg-amber-100 text-amber-700",
  DECOMMISSIONED: "bg-slate-200 text-slate-700",
  ADMIN: "bg-purple-100 text-purple-700",
  INSPECTOR: "bg-blue-100 text-blue-700",
  USER: "bg-slate-200 text-slate-700",
  INACTIVE: "bg-amber-100 text-amber-700",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status] ?? "bg-slate-100 text-slate-700"}`}>
    {status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())}
  </span>
);

export default StatusBadge;
