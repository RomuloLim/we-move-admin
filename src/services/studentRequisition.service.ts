import api from '@/lib/axios';

export const studentRequisitionService = {
    async getAll(filters?: StudentRequisitionFilters): Promise<StudentRequisitionListResponse> {
        //mocked response
        return {
            data: [
                {
                    id: 1,
                    student_id: 123,
                    semester: 3,
                    protocol: "ABC123",
                    status: "pending",
                    street_name: "Rua A",
                    house_number: "100",
                    neighborhood: "Bairro B",
                    city: "Cidade C",
                    phone_contact: "11999999999",
                    birth_date: "2000-01-01",
                    institution_email: "student@example.com",
                    institution_registration: "20210001",
                    institution_id: 1,
                    course_id: 1,
                    atuation_form: "graduation",
                    created_at: "2023-01-01T00:00:00Z",
                    updated_at: "2023-01-01T00:00:00Z",
                },
            ],
            meta: {
                total: 1,
                per_page: filters?.per_page || 15,
                current_page: filters?.page || 1,
                last_page: 1,
                from: 1,
                to: 1,
                links: [],
                path: '/student-requisitions',
            },
            links: {
                first: '/student-requisitions?page=1',
                last: '/student-requisitions?page=1',
                prev: null,
                next: null,
            }
        }

        // const response = await api.get<StudentRequisitionListResponse>('/student-requisitions', {
        //     params: filters
        // });

        // return response.data;
    }
}