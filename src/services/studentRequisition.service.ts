import api from '@/lib/axios';

export const studentRequisitionService = {
    async getAll(filters?: StudentRequisitionFilters): Promise<StudentRequisitionListResponse> {
        const response = await api.get<StudentRequisitionListResponse>('api/v1/requisitions', {
            params: filters
        });

        return response.data;
    }
}