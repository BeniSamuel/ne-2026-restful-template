import { apiClient } from "./http";
import { useReportStore, type Report } from "../store/report.store";

type ApiResponse<T> = { data: T };

export const reportApi = {
  async fetchReports() {
    useReportStore.getState().setLoading(true);
    try {
      const endpoints = [
        ["Extinguisher Inventory", "/reports/extinguishers"],
        ["Inspection Status", "/reports/inspection-status"],
        ["Expired Extinguishers", "/reports/expired"],
        ["Maintenance History", "/reports/maintenance-history"],
      ] as const;
      const responses = await Promise.all(
        endpoints.map(async ([title, endpoint]) => {
          const response = await apiClient.get<ApiResponse<any>>(endpoint);
          return {
            id: endpoint,
            title,
            generatedAt: new Date().toISOString(),
            summary: response.data.data,
          };
        }),
      );
      useReportStore.getState().setReports(responses);
      return responses;
    } finally {
      useReportStore.getState().setLoading(false);
    }
  },

  async fetchReport(endpoint: string): Promise<Report> {
    const response = await apiClient.get<ApiResponse<any>>(endpoint);
    return {
      id: endpoint,
      title: endpoint.replace("/reports/", "").replace(/-/g, " "),
      generatedAt: new Date().toISOString(),
      summary: response.data.data,
    };
  },
};
