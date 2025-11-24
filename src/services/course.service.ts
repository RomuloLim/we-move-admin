import api from '@/lib/axios';

export const courseService = {
    async getAll(filters?: CourseFilters): Promise<CourseListResponse> {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await api.get<CourseListResponse>('api/v1/courses', { params });
        return response.data;
    },

    async getById(id: number): Promise<Course> {
        const response = await api.get<{ data: Course }>(`api/v1/courses/${id}`);
        return response.data.data;
    },

    async create(data: CourseFormData): Promise<CourseCreateResponse> {
        const response = await api.post<CourseCreateResponse>('api/v1/courses', data);
        return response.data;
    },

    async update(id: number, data: CourseFormData): Promise<CourseUpdateResponse> {
        const response = await api.put<CourseUpdateResponse>(`api/v1/courses/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<CourseDeleteResponse> {
        const response = await api.delete<CourseDeleteResponse>(`api/v1/courses/${id}`);
        return response.data;
    },

    async getCoursesOrderedByInstitution(institutionId: number): Promise<CourseListResponse> {
        const response = await api.get<CourseListResponse>(`api/v1/courses/ordered-by-institution/${institutionId}`);
        return response.data;
    },
};
