import api from '@/lib/axios';

export const studentRequisitionService = {
    async getAll(filters?: StudentRequisitionFilters): Promise<StudentRequisitionListResponse> {
        const response = await api.get<StudentRequisitionListResponse>('api/v1/requisitions', {
            params: filters
        });

        return response.data;
    },

    async getById(id: number): Promise<StudentRequisition> {
        const response = await api.get<{ data: StudentRequisition }>(`api/v1/requisitions/${id}`);
        return response.data.data;
    }
}