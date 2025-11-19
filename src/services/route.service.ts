import api from '@/lib/axios';
import type { RouteFilters, RouteResponse, Route } from '@/@types/route';

export const routeService = {
    async getAll(filters?: RouteFilters): Promise<RouteResponse> {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await api.get<RouteResponse>('api/v1/routes', { params });
        return response.data;
    },

    async getById(id: number): Promise<Route> {
        const response = await api.get<{ data: Route }>(`api/v1/routes/${id}`);
        return response.data.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`api/v1/routes/${id}`);
    },
};
