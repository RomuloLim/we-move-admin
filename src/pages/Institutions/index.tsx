import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { institutionService } from '@/services/institution.service';
import { AdminLayout } from '@/components/layout';
import { Button } from '@/components/Button';
import { InstitutionFormModal } from '@/components/Institutions/InstitutionFormModal';
import {
    PageHeader,
    SearchBar,
    EmptyState,
    DataTable,
    TablePagination,
    type PaginationMeta
} from '@/components/common';

export default function InstitutionList() {
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<InstitutionFilters>({
        per_page: 15,
        page: 1,
    });
    const [pagination, setPagination] = useState<PaginationMeta>();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingInstitutionId, setEditingInstitutionId] = useState<number | undefined>(undefined);

    useEffect(() => {
        loadInstitutions();
    }, [filters]);

    async function loadInstitutions() {
        try {
            setLoading(true);
            setError(null);
            const response = await institutionService.getAll(filters);
            setInstitutions(response.data);
            setPagination(response.meta);
        } catch (err) {
            setError('Erro ao carregar instituições. Tente novamente.');
            console.error('Error loading institutions:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleSearch() {
        setFilters(prev => ({
            ...prev,
            search: searchTerm,
            page: 1,
        }));
    }

    function handleOpenCreateModal() {
        setEditingInstitutionId(undefined);
        setIsFormModalOpen(true);
    }

    function handleOpenEditModal(id: number) {
        setEditingInstitutionId(id);
        setIsFormModalOpen(true);
    }

    async function handleDelete(id: number, name: string) {
        if (!confirm(`Tem certeza que deseja remover a instituição "${name}"?`)) {
            return;
        }

        try {
            await institutionService.delete(id);
            toast.success('Instituição removida!', {
                description: 'A instituição foi removida com sucesso.',
            });
            loadInstitutions();
        } catch (err: any) {
            console.error('Error deleting institution:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível remover a instituição. Tente novamente.';
            toast.error('Erro ao remover instituição', {
                description: errorMessage,
            });
        }
    }

    function handleFormSuccess() {
        loadInstitutions();
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

    const hasData = !loading && !error && institutions.length > 0;
    const isEmpty = !loading && !error && institutions.length === 0;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <PageHeader
                    title="Instituições"
                    description="Gerencie as instituições de ensino do sistema"
                    action={{
                        label: 'Nova Instituição',
                        icon: <Plus className="w-4 h-4" />,
                        onClick: handleOpenCreateModal,
                    }}
                />

                {/* Filters */}
                <div className="space-y-4">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                        onSearch={handleSearch}
                        placeholder="Buscar por nome, cidade ou estado..."
                        perPage={filters.per_page}
                        onPerPageChange={handlePerPageChange}
                    />
                </div>

                {/* Content */}
                <DataTable
                    loading={loading}
                    error={error}
                    emptyState={
                        isEmpty ? (
                            <EmptyState
                                title="Nenhuma instituição encontrada"
                                description="Comece adicionando uma nova instituição ao sistema"
                                action={{
                                    label: 'Adicionar Instituição',
                                    icon: <Plus className="w-4 h-4 mr-2" />,
                                    onClick: handleOpenCreateModal,
                                }}
                            />
                        ) : undefined
                    }
                >
                    <DataTable.Header>
                        <DataTable.Head className="w-[100px]">#</DataTable.Head>
                        <DataTable.Head>Nome</DataTable.Head>
                        <DataTable.Head>Cidade/Estado</DataTable.Head>
                        <DataTable.Head>E-mail</DataTable.Head>
                        <DataTable.Head>Telefone</DataTable.Head>
                        <DataTable.Head>Criado em</DataTable.Head>
                        <DataTable.Head className="text-right">Ações</DataTable.Head>
                    </DataTable.Header>
                    <DataTable.Body>
                        {institutions.map((institution, index) => (
                            <DataTable.Row key={institution.id}>
                                <DataTable.Cell className="font-medium">
                                    {pagination ? pagination.from + index : index + 1}
                                </DataTable.Cell>
                                <DataTable.Cell className="font-medium">
                                    {institution.name}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {institution.city}/{institution.state}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {institution.email}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {institution.phone}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {new Date(institution.created_at).toLocaleDateString('pt-BR')}
                                </DataTable.Cell>
                                <DataTable.Cell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleOpenEditModal(institution.id)}
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon-md"
                                            onClick={() => handleDelete(institution.id, institution.name)}
                                        >
                                            <Trash2 className="w-5 h-5" />
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

                {/* Form Modal */}
                <InstitutionFormModal
                    open={isFormModalOpen}
                    onOpenChange={setIsFormModalOpen}
                    institutionId={editingInstitutionId}
                    onSuccess={handleFormSuccess}
                />
            </div>
        </AdminLayout>
    );
}
