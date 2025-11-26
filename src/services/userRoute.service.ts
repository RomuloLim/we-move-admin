import api from '@/lib/axios';
import type { UserRouteResponse, LinkRoutesPayload, UnlinkRoutesPayload } from '@/@types/route';

export const userRouteService = {
    async getAllOrderedByUser(userId: number, page: number = 1, perPage: number = 15): Promise<UserRouteResponse> {
        const response = await api.get<UserRouteResponse>(
            `/api/v1/user-routes/all-ordered-by-user/${userId}`,
            {
                params: {
                    page,
                    per_page: perPage,
                },
            }
        );
        return response.data;
    },

    async linkRoutes(payload: LinkRoutesPayload): Promise<{ message: string }> {
        const response = await api.post<{ message: string }>('/api/v1/user-routes/link', payload);
        return response.data;
    },

    async unlinkRoutes(payload: UnlinkRoutesPayload): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>('/api/v1/user-routes/unlink', {
            params: {
                user_id: payload.user_id,
                'route_ids[]': payload.route_ids,
            },
        });
        return response.data;
    },
};
