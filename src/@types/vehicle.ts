export type Vehicle = {
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

export type VehicleFormData = {
    license_plate: string;
    model: string;
    capacity: number;
};

export type VehicleListResponse = {
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

export type VehicleResponse = {
    data: Vehicle;
};

export type DefaultFilters = {
    per_page?: number;
    page?: number;
    search?: string;
};
