import api from '@/lib/axios';

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

    async getById(id: number): Promise<User> {
        const response = await api.get<{ data: User }>(`api/v1/users/${id}`);
        return response.data.data;
    },

    async create(data: UserFormData): Promise<UserCreateResponse> {
        const response = await api.post<UserCreateResponse>('api/v1/users', data);
        return response.data;
    },

    async update(id: number, data: UserFormData): Promise<UserUpdateResponse> {
        const response = await api.put<UserUpdateResponse>(`api/v1/users/${id}`, data);
        return response.data;
    },
};
