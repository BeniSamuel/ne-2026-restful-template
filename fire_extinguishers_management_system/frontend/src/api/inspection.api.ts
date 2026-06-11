import { apiClient } from "./http";
import { useInspectionStore, type Inspection } from "../store/inspection.store";

type ApiResponse<T> = { data: T };
type Paginated<T> = { items: T[]; total: number; page: number; limit: number };

export type InspectionPayload = Omit<Inspection, "id">;

export const inspectionApi = {
  async fetchInspections(params: Record<string, string> = {}) {
    useInspectionStore.getState().setLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<Inspection[]>>("/inspections", { params });
      const data = response.data.data as Inspection[] | Paginated<Inspection>;
      const items = Array.isArray(data) ? data : data.items;
      useInspectionStore.getState().setInspections(items);
      return items;
    } finally {
      useInspectionStore.getState().setLoading(false);
    }
  },

  async createInspection(payload: InspectionPayload) {
    const response = await apiClient.post<ApiResponse<Inspection>>("/inspections", payload);
    await this.fetchInspections();
    return response.data.data;
  },

  async deleteInspection(id: string) {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/inspections/${id}`);
    await this.fetchInspections();
    return response.data.data;
  },

  async updateInspection(id: string, payload: Partial<InspectionPayload>) {
    const response = await apiClient.put<ApiResponse<Inspection>>(`/inspections/${id}`, payload);
    await this.fetchInspections();
    return response.data.data;
  },
};
