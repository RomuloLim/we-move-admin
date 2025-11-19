export type Stop = {
    id: number;
    route_id: number;
    stop_name: string;
    latitude: string;
    longitude: string;
    scheduled_time: string;
    order: number;
    created_at: string;
    updated_at: string;
};

export type Route = {
    id: number;
    route_name: string;
    description: string;
    stops: Stop[];
    stops_amount: number;
    first_stop: Stop;
    last_stop: Stop;
    created_at: string;
    updated_at: string;
};

export type RouteFilters = {
    search?: string;
    page?: number;
    per_page?: number;
};

export type RouteResponse = {
    data: Route[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        per_page: number;
        to: number;
        total: number;
    };
};
