export enum RequisitionStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REPROVED = 'reproved',
    EXPIRED = 'expired',
}

export const requisitionStatusLabels: Record<RequisitionStatus, string> = {
    [RequisitionStatus.PENDING]: 'Pendente',
    [RequisitionStatus.APPROVED]: 'Aprovado',
    [RequisitionStatus.REPROVED]: 'Reprovado',
    [RequisitionStatus.EXPIRED]: 'Expirado',
};

export const requisitionStatusColors: Record<RequisitionStatus, string> = {
    [RequisitionStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [RequisitionStatus.APPROVED]: 'bg-green-100 text-green-800',
    [RequisitionStatus.REPROVED]: 'bg-red-100 text-red-800',
    [RequisitionStatus.EXPIRED]: 'bg-gray-100 text-gray-800',
};

export const availableRequisitionStatuses: RequisitionStatus[] = [
    RequisitionStatus.PENDING,
    RequisitionStatus.APPROVED,
    RequisitionStatus.REPROVED,
    RequisitionStatus.EXPIRED,
];
