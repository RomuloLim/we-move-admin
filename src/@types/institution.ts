type Institution = {
    id: number;
    name: string;
    acronym?: string;
    street: string;
    neighborhood: string;
    number?: string;
    city: string;
    state: string;
    zip_code: string;
    created_at: string;
    updated_at: string;
};

type InstitutionFormData = {
    name: string;
    street: string;
    acronym?: string;
    neighborhood: string;
    number?: string;
    city: string;
    state: string;
    zip_code: string;
};

type InstitutionFilters = {
    page?: number;
    per_page?: number;
    search?: string;
};

type InstitutionResource = Institution;

type InstitutionListResponse = {
    data: Institution[];
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

type InstitutionCreateResponse = {
    message: string;
    data: InstitutionResource;
};

type InstitutionUpdateResponse = {
    message: string;
    data: InstitutionResource;
};

type InstitutionDeleteResponse = {
    message: string;
};

type LinkCourseRequest = {
    course_ids: number[];
};

type LinkCourseResponse = {
    message: string;
};
