import api from '@/lib/axios';

export const institutionService = {
    async getAll(filters?: InstitutionFilters): Promise<InstitutionListResponse> {
        const params = new URLSearchParams();

        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await api.get<InstitutionListResponse>('api/v1/institutions', { params });
        return response.data;
    },

    async getById(id: number): Promise<Institution> {
        const response = await api.get<{ data: Institution }>(`api/v1/institutions/${id}`);
        return response.data.data;
    },

    async create(data: InstitutionFormData): Promise<InstitutionCreateResponse> {
        const response = await api.post<InstitutionCreateResponse>('api/v1/institutions', data);
        return response.data;
    },

    async update(id: number, data: Partial<InstitutionFormData>): Promise<InstitutionUpdateResponse> {
        const response = await api.put<InstitutionUpdateResponse>(`api/v1/institutions/${id}`, data);
        return response.data;
    },

    async delete(id: number): Promise<InstitutionDeleteResponse> {
        const response = await api.delete<InstitutionDeleteResponse>(`api/v1/institutions/${id}`);
        return response.data;
    },

    async getCourses(institutionId: number): Promise<CourseListResponse> {
        const response = await api.get<CourseListResponse>(`api/v1/institutions/${institutionId}/courses`);
        return response.data;
    },

    async linkCourses(institutionId: number, data: LinkCourseRequest): Promise<LinkCourseResponse> {
        const response = await api.post<LinkCourseResponse>(`api/v1/institutions/${institutionId}/courses`, data);
        return response.data;
    },
};
