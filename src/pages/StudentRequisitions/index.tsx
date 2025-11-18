import { useEffect, useState } from "react";

import { AdminLayout } from "@/components/layout";
import {
    PageHeader,
    SearchBar,
    EmptyState,
    DataTable,
    TablePagination,
} from '@/components/common';

import { Eye, Ban } from "lucide-react";
import { Button } from "@/components/Button";
import { studentRequisitionService } from "@/services/studentRequisition.service";


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
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);

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
        // Logic to handle search
    }

    function handleOpenViewModal(requisitionId: number) {

    }

    function handleRejectRequisition(requisitionId: number) {

    }

    function handlePageChange(page: number) {
        setFilters(prev => ({
            ...prev,
            page,
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
                        placeholder="Buscar por nome, cidade ou estado..."
                        perPage={filters.per_page}
                        onPerPageChange={() => { handlePageChange(1); }}
                    />
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
                        <DataTable.Head>Instituição</DataTable.Head>
                        <DataTable.Head>Curso</DataTable.Head>
                        <DataTable.Head>Forma de Atuação</DataTable.Head>
                        <DataTable.Head className="text-right">Ações</DataTable.Head>
                    </DataTable.Header>
                    <DataTable.Body>
                        {requisitions.map((requisition, index) => (
                            <DataTable.Row key={requisition.id}>
                                <DataTable.Cell className="font-medium">
                                    {pagination ? pagination.from + index : index + 1}
                                </DataTable.Cell>
                                <DataTable.Cell className="font-medium">
                                    {requisition.name}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {requisition.city}/{requisition.state}
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
                                        >
                                            <Eye className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon-md"
                                            onClick={() => handleRejectRequisition(requisition.id)}
                                        >
                                            <Ban className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable.Body>
                </DataTable>
            </div>
        </AdminLayout>
    );
}