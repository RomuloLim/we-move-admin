type StudentRequisition = {
    id: number,
    student_id: number,
    semester: number,
    protocol: string,
    status: string,
    street_name: string,
    house_number: string,
    neighborhood: string,
    city: string,
    phone_contact: string,
    birth_date: string,
    institution_email: string,
    institution_registration: string,
    institution_id: number,
    course_id: number,
    atuation_form: string,
    deny_reason?: string,
    created_at: string,
    updated_at: string,
}

type StudentRequisitionFormData = Omit<StudentRequisition, 'id' | 'created_at' | 'updated_at'>;

type StudentRequisitionFilters = BasicFilter;

type StudentRequisitionResource = StudentRequisition;

type StudentRequisitionListResponse = PaginatedResponse<StudentRequisition>;