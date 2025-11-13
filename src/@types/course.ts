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

type CourseListResponse = {
    data: Course[];
};
