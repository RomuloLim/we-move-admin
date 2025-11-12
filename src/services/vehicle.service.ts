import api from '@/lib/axios';
import type {
    VehicleFormData,
    VehicleListResponse,
    VehicleResponse,
    DefaultFilters,
} from '@/@types';

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;

export const vehicleService = {
    async getAll(filters?: DefaultFilters): Promise<VehicleListResponse> {
        const params = new URLSearchParams();

        if (filters?.per_page) {
            params.append('per_page', filters.per_page.toString());
        }
        if (filters?.page) {
            params.append('page', filters.page.toString());
        }
        if (filters?.search) {
            params.append('search', filters.search);
        }

        const response = await api.get<VehicleListResponse>(
            `/api/v1/vehicles${params.toString() ? `?${params.toString()}` : ''}`
        );
        return response.data;
    },

    async getById(id: number): Promise<VehicleResponse> {
        const response = await api.get<VehicleResponse>(`/api/v1/vehicles/${id}`);
        return response.data;
    },

    async create(data: VehicleFormData): Promise<VehicleResponse> {
        const response = await api.post<VehicleResponse>('/api/v1/vehicles', data);
        return response.data;
    },

    async update(id: number, data: VehicleFormData): Promise<VehicleResponse> {
        const response = await api.put<VehicleResponse>(`/api/v1/vehicles/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>(`/api/v1/vehicles/${id}`);
        return response.data;
    },
};
