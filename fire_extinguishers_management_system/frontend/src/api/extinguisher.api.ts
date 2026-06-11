import { apiClient } from "./http";
import { useExtinguisherStore, type Extinguisher } from "../store/extinguisher.store";

type ApiResponse<T> = { data: T };
type ExtinguisherList = { items: Extinguisher[]; total: number; page: number; limit: number };

const fallbackExtinguishers: Extinguisher[] = [
  {
    id: "44444444-4444-4444-4444-444444444444",
    serialNumber: "TZW-FE-001",
    location: "Main Office - Reception",
    type: "DRY_CHEMICAL",
    size: "5_LBS",
    installationDate: "2025-01-15",
    expiryDate: "2027-01-15",
    status: "ACTIVE",
  },
];

export const extinguisherApi = {
  async fetchExtinguishers(params: Record<string, string> = {}) {
    useExtinguisherStore.getState().setLoading(true);
    try {
      const response = await apiClient.get<ApiResponse<ExtinguisherList>>("/extinguishers", { params });
      const items = response.data.data.items;
      useExtinguisherStore.getState().setExtinguishers(items);
      return items;
    } catch {
      useExtinguisherStore.getState().setExtinguishers(fallbackExtinguishers);
      return fallbackExtinguishers;
    } finally {
      useExtinguisherStore.getState().setLoading(false);
    }
  },

  async createExtinguisher(payload: Omit<Extinguisher, "id">) {
    const response = await apiClient.post<ApiResponse<Extinguisher>>("/extinguishers", payload);
    await this.fetchExtinguishers();
    return response.data.data;
  },

  async deleteExtinguisher(id: string) {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/extinguishers/${id}`);
    await this.fetchExtinguishers();
    return response.data.data;
  },

  async updateExtinguisher(id: string, payload: Partial<Omit<Extinguisher, "id">>) {
    const response = await apiClient.put<ApiResponse<Extinguisher>>(`/extinguishers/${id}`, payload);
    await this.fetchExtinguishers();
    return response.data.data;
  },
};
