import { useEffect, useState } from "react";

import { AdminLayout } from "@/components/layout";
import {
    PageHeader,
    SearchBar,
    EmptyState,
    DataTable,
    TablePagination,
} from '@/components/common';
import { StudentRequisitionViewModal } from '@/components/StudentRequisitions/StudentRequisitionViewModal';

import { Eye, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/Button";
import { studentRequisitionService } from "@/services/studentRequisition.service";
import { RequisitionStatus, requisitionStatusLabels, requisitionStatusColors, availableRequisitionStatuses } from '@/enums/requisitionStatus';
import { atuationFormLabels, availableAtuationForms } from '@/enums/atuationForm';


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
    const [selectedRequisitionId, setSelectedRequisitionId] = useState<number | null>(null);

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
        setFilters(prev => ({
            ...prev,
            protocol: searchTerm,
            page: 1,
        }));
    }

    function handleOpenViewModal(requisitionId: number) {
        setSelectedRequisitionId(requisitionId);
        setViewModalOpen(true);
    }

    function handleApproveRequisition(requisitionId: number) {
        console.log('Approve', requisitionId);
        // TODO: Implementar lógica de aprovação
    }

    function handleRejectRequisition(requisitionId: number) {
        console.log('Reject', requisitionId);
        // TODO: Implementar lógica de rejeição
    }

    function handlePageChange(page: number) {
        setFilters(prev => ({
            ...prev,
            page,
        }));
    }

    function handlePerPageChange(perPage: number) {
        setFilters(prev => ({
            ...prev,
            per_page: perPage,
            page: 1,
        }));
    }

    function handleStatusChange(status: string) {
        setFilters(prev => ({
            ...prev,
            status: (status as StudentRequisitionFilters['status']) || undefined,
            page: 1,
        }));
    }

    function handleAtuationFormChange(atuationForm: string) {
        setFilters(prev => ({
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
                            <select
                                value={filters.status || ''}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Todos</option>
                                {availableRequisitionStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {requisitionStatusLabels[status]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Forma de Atuação
                            </label>
                            <select
                                value={filters.atuation_form || ''}
                                onChange={(e) => handleAtuationFormChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">Todos</option>
                                {availableAtuationForms.map((form) => (
                                    <option key={form} value={form}>
                                        {atuationFormLabels[form]}
                                    </option>
                                ))}
                            </select>
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
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleApproveRequisition(requisition.id)}
                                            title="Aprovar"
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon-md"
                                            onClick={() => handleRejectRequisition(requisition.id)}
                                            title="Reprovar"
                                        >
                                            <Ban className="w-5 h-5" />
                                        </Button>
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
                    onReject={handleRejectRequisition}
                />
            </div>
        </AdminLayout>
    );
}