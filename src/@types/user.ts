export type UserType = 'super-admin' | 'admin' | 'driver' | 'passenger';

export type User = {
    id: number;
    name: string;
    email: string;
    user_type: UserType;
    user_type_label: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
};

export type UserFormData = {
    name: string;
    email: string;
    cpf: string;
    rg: string;
    phone_contact: string;
    profile_picture_url?: string;
    password: string;
    user_type: UserType;
};

export type UserFilters = {
    page?: number;
    per_page?: number;
    search?: string;
    user_type?: UserType;
};

export type UserListResponse = {
    data: User[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        links: Array<{
            url: string | null;
            label: string;
            page: number | null;
            active: boolean;
        }>;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
};

export type UserCreateResponse = {
    message: string;
    data: User;
};
