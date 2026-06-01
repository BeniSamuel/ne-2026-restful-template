import type { BookingStatus } from "../store/booking.store";

const styles: Record<BookingStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  CHECKED_OUT: "bg-blue-100 text-blue-700",
};

const labels: Record<BookingStatus, string> = {
  ACTIVE: "Active",
  CANCELLED: "Cancelled",
  CHECKED_OUT: "Checked out",
};

const StatusBadge = ({ status }: { status: BookingStatus }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-bold ${styles[status]}`}>
    {labels[status]}
  </span>
);

export default StatusBadge;
