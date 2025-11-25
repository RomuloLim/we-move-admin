export type BasicFilter = {
    page?: number;
    per_page?: number;
    search?: string;
};

export type PaginationLinks = {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
};

export type PaginationMeta = {
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

export type PaginatedResponse<T> = {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
};

