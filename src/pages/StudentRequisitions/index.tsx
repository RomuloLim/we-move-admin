import { useEffect, useState } from "react";
import { toast } from 'sonner';

import { AdminLayout } from "@/components/layout";
import {
    PageHeader,
    SearchBar,
    EmptyState,
    DataTable,
    TablePagination,
} from '@/components/common';
import { StudentRequisitionViewModal } from '@/components/StudentRequisitions/StudentRequisitionViewModal';
import { ReproveRequisitionModal } from '@/components/StudentRequisitions/ReproveRequisitionModal';
import { LinkRoutesModal } from '@/components/StudentRequisitions/LinkRoutesModal';

import { Eye, Ban, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/Button";
import { studentRequisitionService } from "@/services/studentRequisition.service";
import { RequisitionStatus, requisitionStatusLabels, requisitionStatusColors, availableRequisitionStatuses } from '@/enums/requisitionStatus';
import { atuationFormLabels, availableAtuationForms } from '@/enums/atuationForm';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


export default function StudentRequisitionList() {
    const [requisitions, setRequisitions] = useState<StudentRequisition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<StudentRequisitionFilters>({
        per_page: 15,
        page: 1,
    });
    const [pagination, setPagination] = useState<PaginationMeta>();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [reproveModalOpen, setReproveModalOpen] = useState(false);
    const [linkRoutesModalOpen, setLinkRoutesModalOpen] = useState(false);
    const [selectedRequisitionId, setSelectedRequisitionId] = useState<number | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const hasData = !loading && !error && requisitions.length > 0;
    const isEmpty = !loading && !error && requisitions.length === 0;

    async function handleLoadRequisitions() {
        try {
            setLoading(true);
            setError(null);
            const response = await studentRequisitionService.getAll(filters);
            setRequisitions(response.data);
            setPagination(response.meta);
        } catch (err) {
            setError('Erro ao carregar requisições. Tente novamente.');
            console.error('Error loading requisitions:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch() {
        setFilters((prev: StudentRequisitionFilters) => ({
            ...prev,
            protocol: searchTerm,
            page: 1,
        }));
    }

    function handleOpenViewModal(requisitionId: number) {
        setSelectedRequisitionId(requisitionId);
        setViewModalOpen(true);
    }

    async function handleApproveRequisition(requisitionId: number, userId?: number) {
        try {
            setActionLoading(true);
            await studentRequisitionService.approve(requisitionId);

            toast.success('Solicitação aprovada com sucesso!');

            // Reload the list
            await handleLoadRequisitions();

            // Close modal if open
            setViewModalOpen(false);

            // Open link routes modal if userId is provided
            if (userId) {
                setSelectedUserId(userId);
                setLinkRoutesModalOpen(true);
            }
        } catch (err: any) {
            console.error('Error approving requisition:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível aprovar a solicitação. Tente novamente.';
            toast.error('Erro ao aprovar solicitação', {
                description: errorMessage,
            });
        } finally {
            setActionLoading(false);
        }
    }

    function handleOpenReproveModal(requisitionId: number) {
        setSelectedRequisitionId(requisitionId);
        setReproveModalOpen(true);
    }

    function handleOpenLinkRoutesModal(userId: number) {
        setSelectedUserId(userId);
        setLinkRoutesModalOpen(true);
    }

    async function handleRejectRequisition(data: { deny_reason: string; reproved_fields: string[] }) {
        if (!selectedRequisitionId) return;

        try {
            setActionLoading(true);
            await studentRequisitionService.reprove(selectedRequisitionId, data);

            toast.success('Solicitação reprovada com sucesso!');

            // Reload the list
            await handleLoadRequisitions();

            // Close modals
            setReproveModalOpen(false);
            setViewModalOpen(false);
        } catch (err: any) {
            console.error('Error rejecting requisition:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível reprovar a solicitação. Tente novamente.';
            toast.error('Erro ao reprovar solicitação', {
                description: errorMessage,
            });
        } finally {
            setActionLoading(false);
        }
    }

    function handlePageChange(page: number) {
        setFilters((prev: StudentRequisitionFilters) => ({
            ...prev,
            page,
        }));
    }

    function handlePerPageChange(perPage: number) {
        setFilters((prev: StudentRequisitionFilters) => ({
            ...prev,
            per_page: perPage,
            page: 1,
        }));
    }

    function handleStatusChange(status: string) {
        setFilters((prev: StudentRequisitionFilters) => ({
            ...prev,
            status: (status as StudentRequisitionFilters['status']) || undefined,
            page: 1,
        }));
    }

    function handleAtuationFormChange(atuationForm: string) {
        setFilters((prev: StudentRequisitionFilters) => ({
            ...prev,
            atuation_form: (atuationForm as StudentRequisitionFilters['atuation_form']) || undefined,
            page: 1,
        }));
    }

    useEffect(() => {
        handleLoadRequisitions();
    }, [filters]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <PageHeader
                    title="Requisições de Alunos"
                    description="Gerencie as requisições de alunos do sistema"
                />

                {/* Filters */}
                <div className="space-y-4">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onSearch={handleSearch}
                        placeholder="Buscar por protocolo..."
                        perPage={filters.per_page}
                        onPerPageChange={handlePerPageChange}
                    />

                    {/* Filter by Status and Atuation Form */}
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <Select
                                value={filters.status || 'all'}
                                onValueChange={(value) => handleStatusChange(value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {availableRequisitionStatuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {requisitionStatusLabels[status]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Forma de Atuação
                            </label>
                            <Select
                                value={filters.atuation_form || 'all'}
                                onValueChange={(value) => handleAtuationFormChange(value === 'all' ? '' : value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {availableAtuationForms.map((form) => (
                                        <SelectItem key={form} value={form}>
                                            {atuationFormLabels[form]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <DataTable
                    loading={loading}
                    error={error}
                    emptyState={
                        isEmpty ? (
                            <EmptyState
                                title="Nenhuma Requisição encontrada"
                                description="As requisições de alunos criadas aparecerão aqui."
                            />
                        ) : undefined
                    }
                >
                    <DataTable.Header>
                        <DataTable.Head className="w-[100px]">Protocolo</DataTable.Head>
                        <DataTable.Head>Estudante</DataTable.Head>
                        <DataTable.Head>Status</DataTable.Head>
                        <DataTable.Head>Semestre</DataTable.Head>
                        <DataTable.Head>Criado em</DataTable.Head>
                        <DataTable.Head className="text-right">Ações</DataTable.Head>
                    </DataTable.Header>
                    <DataTable.Body>
                        {requisitions.map((requisition) => (
                            <DataTable.Row key={requisition.id}>
                                <DataTable.Cell className="font-medium">
                                    {requisition.protocol}
                                </DataTable.Cell>
                                <DataTable.Cell className="font-medium">
                                    {requisition.student.user.name}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${requisitionStatusColors[requisition.status as RequisitionStatus]}`}>
                                        {requisitionStatusLabels[requisition.status as RequisitionStatus] || requisition.status}
                                    </span>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {requisition.semester}º
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {new Date(requisition.created_at).toLocaleDateString('pt-BR')}
                                </DataTable.Cell>
                                <DataTable.Cell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleOpenViewModal(requisition.id)}
                                            title="Ver detalhes"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </Button>
                                        {requisition.status === RequisitionStatus.APPROVED && (
                                            <Button
                                                variant="secondary"
                                                size="icon-md"
                                                onClick={() => handleOpenLinkRoutesModal(requisition.student.user.id)}
                                                title="Vincular rotas"
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            >
                                                <MapPin className="w-5 h-5" />
                                            </Button>
                                        )}
                                        {requisition.status === RequisitionStatus.REPROVED && (
                                            <Button
                                                variant="secondary"
                                                size="icon-md"
                                                onClick={() => handleApproveRequisition(requisition.id, requisition.student.user.id)}
                                                title="Aprovar"
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                disabled={actionLoading}
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                            </Button>
                                        )}
                                        {requisition.status === RequisitionStatus.PENDING && (
                                            <>
                                                <Button
                                                    variant="secondary"
                                                    size="icon-md"
                                                    onClick={() => handleApproveRequisition(requisition.id, requisition.student.user.id)}
                                                    title="Aprovar"
                                                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                    disabled={actionLoading}
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="icon-md"
                                                    onClick={() => handleOpenReproveModal(requisition.id)}
                                                    title="Reprovar"
                                                    disabled={actionLoading}
                                                >
                                                    <Ban className="w-5 h-5" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>
                </DataTable>

                {/* Pagination */}
                {hasData && pagination && (
                    <TablePagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* View Modal */}
                <StudentRequisitionViewModal
                    open={viewModalOpen}
                    onOpenChange={setViewModalOpen}
                    requisitionId={selectedRequisitionId}
                    onApprove={handleApproveRequisition}
                    onReject={(id) => handleOpenReproveModal(id)}
                />

                {/* Reprove Modal */}
                <ReproveRequisitionModal
                    open={reproveModalOpen}
                    onOpenChange={setReproveModalOpen}
                    onConfirm={handleRejectRequisition}
                    loading={actionLoading}
                />

                {/* Link Routes Modal */}
                <LinkRoutesModal
                    open={linkRoutesModalOpen}
                    onOpenChange={setLinkRoutesModalOpen}
                    userId={selectedUserId!}
                    onSuccess={handleLoadRequisitions}
                />
            </div>
        </AdminLayout>
    );
}