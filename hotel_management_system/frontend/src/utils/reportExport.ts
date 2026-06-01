import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Booking } from "../store/booking.store";
import type { Report } from "../store/report.store";

const downloadFile = (content: string, fileName: string, type: string) => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadBookingsCsv = (bookings: Booking[]) => {
  const rows = bookings.map((booking) => [
    booking.id,
    booking.hotel.name,
    `${booking.user.firstName} ${booking.user.lastName}`,
    booking.status,
    new Date(booking.checkInDate).toLocaleDateString(),
    new Date(booking.checkOutDate).toLocaleDateString(),
  ]);
  const csv = [["ID", "Hotel", "Guest", "Status", "Check in", "Check out"], ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  downloadFile(csv, "hotel-bookings-report.csv", "text/csv;charset=utf-8");
};

export const downloadBookingsPdf = (bookings: Booking[], reports: Report[]) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Hotel Management Report", 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 26);
  doc.text(`Reports: ${reports.length} | Bookings: ${bookings.length}`, 14, 33);

  autoTable(doc, {
    body: bookings.map((booking) => [
      booking.id,
      booking.hotel.name,
      `${booking.user.firstName} ${booking.user.lastName}`,
      booking.status,
      new Date(booking.checkInDate).toLocaleDateString(),
      new Date(booking.checkOutDate).toLocaleDateString(),
    ]),
    head: [["ID", "Hotel", "Guest", "Status", "Check in", "Check out"]],
    startY: 42,
    styles: { fontSize: 9 },
  });

  doc.save("hotel-bookings-report.pdf");
};
