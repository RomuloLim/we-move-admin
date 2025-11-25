type StudentRequisition = {
    id: number;
    student_id: number;
    protocol: string;
    status: string;
    semester: number;
    street_name: string;
    house_number: string;
    neighborhood: string;
    city: string;
    phone_contact: string;
    birth_date: string;
    atuation_form: string;
    deny_reason: string | null;
    institution_course: {
        id: number;
        institution_id: number;
        course_id: number;
        created_at: string | null;
        updated_at: string | null;
    };
    student: {
        id: number;
        user_id: number;
        institution_course_id: number;
        city_of_origin: string;
        status: string;
        qrcode_token: string | null;
        created_at: string;
        updated_at: string;
        user: User;
    };
    created_at: string;
    updated_at: string;
}

type StudentRequisitionFormData = Omit<StudentRequisition, 'id' | 'created_at' | 'updated_at'>;

type StudentRequisitionFilters = BasicFilter & {
    atuation_form?: 'student' | 'bolsist' | 'teacher' | 'prep_course' | 'other';
    deny_reason?: string | null;
    institution_course_id?: number | null;
    protocol?: string | null;
    status?: 'pending' | 'approved' | 'reproved' | 'expired';
};

type StudentRequisitionResource = StudentRequisition;

type StudentRequisitionListResponse = PaginatedResponse<StudentRequisition>;