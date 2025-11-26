import api from '@/lib/axios';

type ReproveRequisitionData = {
    deny_reason: string;
    reproved_fields: string[];
};

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
    },

    async approve(id: number): Promise<{ message: string }> {
        const response = await api.patch<{ message: string }>(`api/v1/requisitions/${id}/approve`);
        return response.data;
    },

    async reprove(id: number, data: ReproveRequisitionData): Promise<{ message: string }> {
        const response = await api.patch<{ message: string }>(`api/v1/requisitions/${id}/reprove`, data);
        return response.data;
    }
}