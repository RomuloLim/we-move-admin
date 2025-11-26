import api from "@/lib/axios";
import type { CreateNoticePayload, Notice } from "@/@types/notice";
import type { PaginatedResponse } from "@/@types/commons";

export async function getNotices(page: number = 1, routeIds?: number[]): Promise<PaginatedResponse<Notice>> {
    const params = new URLSearchParams();

    params.append("page", page.toString());
    params.append("per_page", "5");

    if (routeIds && routeIds.length > 0) {
        routeIds.forEach(id => params.append("route_ids[]", id.toString()));
    }

    const response = await api.get<PaginatedResponse<Notice>>(`api/v1/notices?${params.toString()}`);
    return response.data;
}

export async function createNotice(payload: CreateNoticePayload): Promise<{ message: string; data: Notice[] }> {
    const response = await api.post<{ message: string; data: Notice[] }>("api/v1/notices", payload);
    return response.data;
}

export async function deleteNotice(id: number): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`api/v1/notices/${id}`);
    return response.data;
}
