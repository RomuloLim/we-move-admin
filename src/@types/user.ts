type UserType = 'super-admin' | 'admin' | 'driver' | 'student';

type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    cpf: string;
    rg: string;
    phone_contact: string;
    user_type: 'admin' | 'driver';
    user_type_label: string;
    created_at: string;
    updated_at: string;
    profile_picture_url?: string;
};

type UserFormData = {
    name: string;
    email: string;
    cpf: string;
    rg: string;
    phone_contact: string;
    profile_picture_url?: string;
    password: string;
    user_type: UserType;
};

type UserFilters = {
    page?: number;
    per_page?: number;
    search?: string;
    type?: UserType;
};

type UserListResponse = {
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

type UserCreateResponse = {
    message: string;
    data: User;
};

type UserUpdateResponse = {
    message: string;
    data: User;
};
