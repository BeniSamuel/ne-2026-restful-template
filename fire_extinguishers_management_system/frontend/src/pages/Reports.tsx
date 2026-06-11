import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { reportApi } from "../api/report.api";
import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import PageTitle from "../components/PageTitle";
import PaginatedList from "../components/PaginatedList";
import Dashboard from "../layout/dashboard/Dashboard";
import { useReportStore } from "../store/report.store";
import { useSearchStore } from "../store/search.store";
import { downloadReportsCsv, downloadReportsPdf } from "../utils/reportExport";

const reportActions = [
  { label: "Total Extinguishers", endpoint: "/reports/extinguishers" },
  { label: "Inspection Status", endpoint: "/reports/inspection-status" },
  { label: "Expired Extinguishers", endpoint: "/reports/expired" },
  { label: "Maintenance History", endpoint: "/reports/maintenance-history" },
];

const Reports = () => {
  const reports = useReportStore((state) => state.reports);
  const setReports = useReportStore((state) => state.setReports);
  const query = useSearchStore((state) => state.query.toLowerCase());

  useEffect(() => {
    void reportApi.fetchReports();
  }, []);

  const filteredReports = useMemo(
    () => reports.filter((report) => `${report.title} ${JSON.stringify(report.summary)}`.toLowerCase().includes(query)),
    [query, reports],
  );

  async function generate(endpoint: string) {
    try {
      const report = await reportApi.fetchReport(endpoint);
      setReports([report, ...reports.filter((item) => item.id !== report.id)]);
      toast.success("Report generated");
    } catch {
      toast.error("Report generation failed");
    }
  }

  function exportReports(format: "csv" | "pdf") {
    const reportsToExport = filteredReports.length ? filteredReports : reports;
    if (!reportsToExport.length) {
      toast.error("Generate a report before exporting");
      return;
    }

    if (format === "csv") {
      downloadReportsCsv(reportsToExport);
      toast.success("CSV export started");
      return;
    }

    downloadReportsPdf(reportsToExport);
    toast.success("PDF export started");
  }

  return (
    <Dashboard>
      <PageTitle subtitle="Generate operational reports for extinguishers, inspections, expiry and maintenance history." title="Reports" />

      <DashboardCard className="mb-8">
        <div className="grid gap-3 md:grid-cols-4">
          {reportActions.map((action) => (
            <FormButton className="h-12" key={action.endpoint} onClick={() => void generate(action.endpoint)} variant="soft">
              {action.label}
            </FormButton>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <div className="w-44">
            <FormButton className="h-11" onClick={() => exportReports("csv")} type="button" variant="soft">
              Export CSV
            </FormButton>
          </div>
          <div className="w-44">
            <FormButton className="h-11" onClick={() => exportReports("pdf")} type="button">
              Export PDF
            </FormButton>
          </div>
        </div>
      </DashboardCard>

      <PaginatedList
        className="grid gap-5 md:grid-cols-2"
        emptyMessage="No reports match your search."
        emptyTitle="No reports found"
        items={filteredReports}
        renderItem={(report) => (
          <DashboardCard key={report.id}>
            <h2 className="text-xl font-bold text-black">{report.title}</h2>
            <p className="mt-2 text-sm font-medium text-black/45">Generated {new Date(report.generatedAt).toLocaleString()}</p>
            <pre className="mt-5 max-h-72 overflow-auto rounded-2xl bg-white p-4 text-xs text-black/70">
              {JSON.stringify(report.summary, null, 2)}
            </pre>
          </DashboardCard>
        )}
      />
    </Dashboard>
  );
};

export default Reports;
