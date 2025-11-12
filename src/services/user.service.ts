import api from '@/lib/axios';
import type {
    UserData,
    UserFilters,
    UserListResponse,
    UserFormData,
    UserCreateResponse,
} from '@/@types';

export const userService = {
    async getAll(filters?: UserFilters): Promise<UserListResponse> {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await api.get<UserListResponse>('api/v1/users', { params });
        return response.data;
    },

    async getById(id: number): Promise<UserData> {
        const response = await api.get<{ data: UserData }>(`/users/${id}`);
        return response.data.data;
    },

    async create(data: UserFormData): Promise<UserCreateResponse> {
        const response = await api.post<UserCreateResponse>('api/v1/users', data);
        return response.data;
    },
};
