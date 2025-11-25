export type NoticeType = "general" | "route_alert";

export type Notice = {
    id: number;
    author_user_id: number;
    title: string;
    content: string;
    type: NoticeType;
    type_label: string;
    route_id: number | null;
    created_at: string;
    updated_at: string;
};

export type CreateNoticePayload = {
    title: string;
    content: string;
    type: NoticeType;
    route_ids?: number[] | null;
};
