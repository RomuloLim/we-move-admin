import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Log detalhado do erro
        console.error('API Error:', {
            message: error.message,
            code: error.code,
            config: error.config,
            response: error.response?.data,
        });

        // Se for erro 419 (CSRF token mismatch), renovar e tentar novamente
        if (error.response?.status === 419 && !error.config._retry) {
            error.config._retry = true;
            try {
                await getCsrfCookie();
                return api.request(error.config);
            } catch (retryError) {
                return Promise.reject(retryError);
            }
        }

        // Se for erro 401, limpar autenticação
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

// Function to initialize CSRF protection
export const getCsrfCookie = async () => {
    return api.get('/sanctum/csrf-cookie');
};

export default api;