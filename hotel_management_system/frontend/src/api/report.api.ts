import { apiClient } from "./http";
import { useReportStore, type Report } from "../store/report.store";

export type ReportPayload = {
  periodEnd: string;
  periodStart: string;
};

export const reportApi = {
  async fetchReports() {
    useReportStore.getState().setLoading(true);
    try {
      const response = await apiClient.get<Report[]>("/reports");
      useReportStore.getState().setReports(response.data);
      return response.data;
    } finally {
      useReportStore.getState().setLoading(false);
    }
  },

  async generateReport(payload: ReportPayload) {
    const response = await apiClient.post<Report>("/reports/generate", payload);
    await this.fetchReports();
    return response.data;
  },
};
