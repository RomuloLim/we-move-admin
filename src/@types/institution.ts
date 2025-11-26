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
    is_linked?: boolean;
};

type InstitutionFormData = Omit<Institution, 'id' | 'created_at' | 'updated_at'>;

type InstitutionFilters = {
    page?: number;
    per_page?: number;
    search?: string;
};

type InstitutionResource = Institution;

type InstitutionListResponse = PaginatedResponse<Institution>;


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
