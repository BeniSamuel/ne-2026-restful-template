import { apiClient } from "./http";
import { useMaintenanceStore, type MaintenanceRecord } from "../store/maintenance.store";

type ApiResponse<T> = { data: T };
type Paginated<T> = { items: T[]; total: number; page: number; limit: number };
export type MaintenancePayload = Omit<MaintenanceRecord, "id">;

export const maintenanceApi = {
  async fetchMaintenance(params: Record<string, string> = {}) {
    useMaintenanceStore.getState().setLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<MaintenanceRecord[]>>("/maintenance", { params });
      const data = response.data.data as MaintenanceRecord[] | Paginated<MaintenanceRecord>;
      const items = Array.isArray(data) ? data : data.items;
      useMaintenanceStore.getState().setRecords(items);
      return items;
    } finally {
      useMaintenanceStore.getState().setLoading(false);
    }
  },

  async createMaintenance(payload: MaintenancePayload) {
    const response = await apiClient.post<ApiResponse<MaintenanceRecord>>("/maintenance", payload);
    await this.fetchMaintenance();
    return response.data.data;
  },

  async deleteMaintenance(id: string) {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/maintenance/${id}`);
    await this.fetchMaintenance();
    return response.data.data;
  },

  async updateMaintenance(id: string, payload: Partial<MaintenancePayload>) {
    const response = await apiClient.put<ApiResponse<MaintenanceRecord>>(`/maintenance/${id}`, payload);
    await this.fetchMaintenance();
    return response.data.data;
  },
};
