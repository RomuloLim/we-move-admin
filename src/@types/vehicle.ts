type Vehicle = {
    id: number;
    license_plate: string;
    brand: string;
    model: string;
    year: number;
    color: string;
    capacity: number;
    status: 'available' | 'in_use' | 'maintenance' | 'inactive';
    created_at: string;
    updated_at: string;
};

type VehicleFormData = {
    license_plate: string;
    model: string;
    capacity: number;
};

type VehicleListResponse = {
    data: Vehicle[];
    meta?: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
};

type VehicleResponse = {
    data: Vehicle;
};

type DefaultFilters = {
    per_page?: number;
    page?: number;
    search?: string;
};
