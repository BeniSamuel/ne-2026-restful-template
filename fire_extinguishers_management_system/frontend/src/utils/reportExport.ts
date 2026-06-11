import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Extinguisher } from "../store/extinguisher.store";
import type { Inspection } from "../store/inspection.store";
import type { Report } from "../store/report.store";

const downloadFile = (content: string, filename: string, type: string) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadExtinguishersCsv = (extinguishers: Extinguisher[]) => {
  const rows = extinguishers.map((item) => [
    item.serialNumber,
    item.location,
    item.type,
    item.size,
    item.expiryDate,
    item.status,
  ]);
  const csv = [["Serial", "Location", "Type", "Size", "Expiry", "Status"], ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  downloadFile(csv, "fire-extinguishers-report.csv", "text/csv;charset=utf-8");
};

export const downloadInspectionsPdf = (inspections: Inspection[]) => {
  const doc = new jsPDF();
  doc.text("Fire Extinguisher Inspection Report", 14, 18);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);

  autoTable(doc, {
    body: inspections.map((inspection) => [
      inspection.id.slice(0, 8),
      inspection.extinguisherId.slice(0, 8),
      inspection.inspectorId.slice(0, 8),
      inspection.inspectionStatus,
      new Date(inspection.scheduledDate).toLocaleString(),
    ]),
    head: [["ID", "Extinguisher", "Inspector", "Status", "Scheduled"]],
    startY: 36,
  });

  doc.save("fire-inspections-report.pdf");
};

export const downloadReportsCsv = (reports: Report[]) => {
  const rows = reports.map((report) => [
    report.title,
    new Date(report.generatedAt).toLocaleString(),
    JSON.stringify(report.summary).replace(/\n/g, " "),
  ]);
  const csv = [["Report", "Generated At", "Summary"], ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  downloadFile(csv, "fire-safety-reports.csv", "text/csv;charset=utf-8");
};

export const downloadReportsPdf = (reports: Report[]) => {
  const doc = new jsPDF();
  doc.text("TZW Fire Safety Reports", 14, 18);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);

  autoTable(doc, {
    body: reports.map((report) => [
      report.title,
      new Date(report.generatedAt).toLocaleString(),
      JSON.stringify(report.summary).slice(0, 450),
    ]),
    head: [["Report", "Generated At", "Summary"]],
    startY: 36,
    styles: { fontSize: 8, cellWidth: "wrap" },
    columnStyles: {
      0: { cellWidth: 42 },
      1: { cellWidth: 38 },
      2: { cellWidth: 105 },
    },
  });

  doc.save("fire-safety-reports.pdf");
};
