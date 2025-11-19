import api from '@/lib/axios';
import type { RouteFilters, RouteResponse, Route, Stop } from '@/@types/route';

type CreateRoutePayload = {
    route_name: string;
    description: string;
};

type UpdateRoutePayload = Partial<CreateRoutePayload>;

type CreateStopPayload = {
    route_id: number;
    stop_name: string;
    latitude?: string;
    longitude?: string;
};

type UpdateStopOrderPayload = {
    stops: {
        stop_id: number;
        order: number;
    }[];
};

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

    async create(data: CreateRoutePayload): Promise<Route> {
        const response = await api.post<{ data: Route }>('api/v1/routes', data);
        return response.data.data;
    },

    async update(id: number, data: UpdateRoutePayload): Promise<Route> {
        const response = await api.put<{ data: Route }>(`api/v1/routes/${id}`, data);
        return response.data.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`api/v1/routes/${id}`);
    },
};

export const stopService = {
    async create(data: CreateStopPayload): Promise<Stop> {
        const response = await api.post<{ data: Stop }>('api/v1/stops', data);
        return response.data.data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`api/v1/stops/${id}`);
    },

    async updateOrder(data: UpdateStopOrderPayload): Promise<void> {
        await api.patch('api/v1/stops/update-order', data);
    },
};
