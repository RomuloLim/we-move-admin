type Course = {
    id: number;
    name: string;
    code: string;
    description?: string;
    duration_semesters?: number;
    created_at: string;
    updated_at: string;
};

type CourseResource = Course;

type CourseFormData = {
    name: string;
    code: string;
    description?: string;
    duration_semesters?: number;
};

type CourseFilters = {
    page?: number;
    per_page?: number;
    search?: string;
};

type CourseListResponse = {
    data: Course[];
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

type CourseCreateResponse = {
    message: string;
    data: CourseResource;
};

type CourseUpdateResponse = {
    message: string;
    data: CourseResource;
};

type CourseDeleteResponse = {
    message: string;
};
