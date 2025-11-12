type LoginCredentials = {
    email: string;
    password: string;
};

type LoginResponse = {
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
    };
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
};
