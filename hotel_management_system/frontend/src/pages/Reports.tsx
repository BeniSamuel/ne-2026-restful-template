import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { bookingApi } from "../api/booking.api";
import { reportApi } from "../api/report.api";
import DashboardCard from "../components/DashboardCard";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import PageTitle from "../components/PageTitle";
import PaginatedList from "../components/PaginatedList";
import Dashboard from "../layout/dashboard/Dashboard";
import { useBookingStore } from "../store/booking.store";
import { useReportStore } from "../store/report.store";
import { useSearchStore } from "../store/search.store";
import { downloadBookingsCsv, downloadBookingsPdf } from "../utils/reportExport";
import { dateRangeIsValid } from "../utils/validators";

const Reports = () => {
  const bookings = useBookingStore((state) => state.bookings);
  const reports = useReportStore((state) => state.reports);
  const query = useSearchStore((state) => state.query.toLowerCase());
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");

  useEffect(() => {
    void reportApi.fetchReports();
    void bookingApi.fetchAll();
  }, []);

  const filteredReports = useMemo(
    () =>
      reports.filter((report) =>
        `${report.id} ${report.totalBookings} ${report.totalCheckedOutBookings} ${new Date(report.periodStart).toLocaleDateString()} ${new Date(
          report.periodEnd,
        ).toLocaleDateString()} ${new Date(report.generatedAt).toLocaleDateString()}`
          .toLowerCase()
          .includes(query),
      ),
    [query, reports],
  );

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!dateRangeIsValid(periodStart, periodEnd)) {
      toast.error("Choose a valid report period");
      return;
    }

    try {
      await reportApi.generateReport({
        periodEnd: new Date(periodEnd).toISOString(),
        periodStart: new Date(periodStart).toISOString(),
      });
      toast.success("Report generated");
      setPeriodStart("");
      setPeriodEnd("");
    } catch {
      toast.error("Report generation failed");
    }
  }

  function handleDownload(format: "csv" | "pdf") {
    if (bookings.length === 0) {
      toast.error("There are no bookings to download");
      return;
    }

    if (format === "csv") {
      downloadBookingsCsv(bookings);
      toast.success("CSV download started");
      return;
    }

    downloadBookingsPdf(bookings, reports);
    toast.success("PDF download started");
  }

  return (
    <Dashboard>
      <PageTitle subtitle="Generate reports and download booking data as CSV or PDF." title="Reports" />

      <DashboardCard className="mb-8">
        <form className="grid gap-5 md:grid-cols-[1fr_1fr_180px]" onSubmit={handleGenerate}>
          <FormInput label="Period start" onChange={setPeriodStart} type="datetime-local" value={periodStart} />
          <FormInput label="Period end" onChange={setPeriodEnd} type="datetime-local" value={periodEnd} />
          <div className="pt-8">
            <FormButton className="h-12" type="submit">
              Generate
            </FormButton>
          </div>
        </form>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="w-44">
            <FormButton className="h-11" onClick={() => handleDownload("csv")} variant="soft">
              Download CSV
            </FormButton>
          </div>
          <div className="w-44">
            <FormButton className="h-11" onClick={() => handleDownload("pdf")}>
              Download PDF
            </FormButton>
          </div>
        </div>
      </DashboardCard>

      <PaginatedList
        className="grid gap-5 md:grid-cols-2"
        emptyMessage="No reports match your search or date range."
        emptyTitle="No reports found"
        items={filteredReports}
        renderItem={(report) => (
          <DashboardCard key={report.id}>
            <h2 className="text-xl font-bold text-black">Report #{report.id}</h2>
            <p className="mt-3 text-sm font-medium text-black/45">
              {new Date(report.periodStart).toLocaleDateString()} - {new Date(report.periodEnd).toLocaleDateString()}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-bold text-black/45">Bookings</p>
                <p className="mt-2 text-2xl font-bold text-black">{report.totalBookings}</p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-bold text-black/45">Checked out</p>
                <p className="mt-2 text-2xl font-bold text-black">{report.totalCheckedOutBookings}</p>
              </div>
            </div>
          </DashboardCard>
        )}
      />
    </Dashboard>
  );
};

export default Reports;
