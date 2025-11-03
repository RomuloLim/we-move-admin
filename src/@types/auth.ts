export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type LoginResponse = {
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
    };
};

export type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
};
