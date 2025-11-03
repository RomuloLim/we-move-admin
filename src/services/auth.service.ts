import api, { getCsrfCookie } from '@/lib/axios';
import type { LoginCredentials, LoginResponse } from '@/@types';

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        // First, get CSRF cookie from Sanctum
        await getCsrfCookie();

        // Then, make the login request
        const response = await api.post<LoginResponse>(
            '/api/v1/auth/login',
            credentials
        );
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/api/v1/auth/logout');
        } catch (error) {
            // Even if logout fails on server, we clear local data
            console.error('Logout error:', error);
        }
    },

    async getCurrentUser() {
        const response = await api.get('/api/v1/auth/me');
        return response.data;
    },
};
