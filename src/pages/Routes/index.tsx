import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { routeService } from '@/services/route.service';
import type { Route, RouteFilters } from '@/@types/route';
import { AdminLayout } from '@/components/layout';
import { Button } from '@/components/Button';
import { RouteFormModal } from '@/components/Routes/RouteFormModal';
import {
    PageHeader,
    SearchBar,
    EmptyState,
    DataTable,
    TablePagination,
    type PaginationMeta
} from '@/components/common';

export default function RouteList() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<RouteFilters>({
        per_page: 15,
        page: 1,
    });
    const [pagination, setPagination] = useState<PaginationMeta>();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingRouteId, setEditingRouteId] = useState<number | undefined>(undefined);

    useEffect(() => {
        loadRoutes();
    }, [filters]);

    async function loadRoutes() {
        try {
            setLoading(true);
            setError(null);
            const response = await routeService.getAll(filters);
            setRoutes(response.data);
            setPagination(response.meta);
        } catch (err) {
            setError('Erro ao carregar rotas. Tente novamente.');
            console.error('Error loading routes:', err);
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
        setEditingRouteId(undefined);
        setIsFormModalOpen(true);
    }

    function handleEdit(id: number) {
        setEditingRouteId(id);
        setIsFormModalOpen(true);
    }

    function handleFormSuccess() {
        loadRoutes();
    }

    async function handleDelete(id: number, name: string) {
        if (!confirm(`Tem certeza que deseja remover a rota "${name}"?`)) {
            return;
        }

        try {
            await routeService.delete(id);
            toast.success('Rota removida!', {
                description: 'A rota foi removida com sucesso.',
            });
            loadRoutes();
        } catch (err: any) {
            console.error('Error deleting route:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível remover a rota. Tente novamente.';
            toast.error('Erro ao remover rota', {
                description: errorMessage,
            });
        }
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

    const hasData = !loading && !error && routes.length > 0;
    const isEmpty = !loading && !error && routes.length === 0;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <PageHeader
                    title="Rotas"
                    description="Gerencie as rotas e paradas do sistema"
                    action={{
                        label: 'Nova Rota',
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
                        placeholder="Buscar por nome da rota ou descrição..."
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
                                title="Nenhuma rota encontrada"
                                description="Comece adicionando uma nova rota ao sistema"
                                action={{
                                    label: 'Adicionar Rota',
                                    icon: <Plus className="w-4 h-4 mr-2" />,
                                    onClick: handleOpenCreateModal,
                                }}
                            />
                        ) : undefined
                    }
                >
                    <DataTable.Header>
                        <DataTable.Head className="w-[80px]">#</DataTable.Head>
                        <DataTable.Head>Nome da Rota</DataTable.Head>
                        <DataTable.Head>Paradas</DataTable.Head>
                        <DataTable.Head>Primeira Parada</DataTable.Head>
                        <DataTable.Head>Última Parada</DataTable.Head>
                        <DataTable.Head>Criado em</DataTable.Head>
                        <DataTable.Head className="text-right">Ações</DataTable.Head>
                    </DataTable.Header>
                    <DataTable.Body>
                        {routes.map((route, index) => (
                            <DataTable.Row key={route.id}>
                                <DataTable.Cell className="font-medium">
                                    {pagination ? pagination.from + index : index + 1}
                                </DataTable.Cell>
                                <DataTable.Cell className="font-medium">
                                    <div>
                                        <div className="font-medium truncate max-w-3xs">{route.route_name}</div>
                                        {route.description && (
                                            <div className="text-sm text-muted-foreground truncate max-w-3xs">
                                                {route.description}
                                            </div>
                                        )}
                                    </div>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <span className="font-semibold">{route.stops_amount}</span>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <div className="font-medium truncate max-w-3xs">{route.first_stop?.stop_name}</div>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <div className="font-medium truncate max-w-3xs">{route.last_stop?.stop_name}</div>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {new Date(route.created_at).toLocaleDateString('pt-BR')}
                                </DataTable.Cell>
                                <DataTable.Cell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* TODO: Implementar visualização de rota
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleView(route.id)}
                                            title="Visualizar"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </Button>
                                        */}
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleEdit(route.id)}
                                            title="Editar"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon-md"
                                            onClick={() => handleDelete(route.id, route.route_name)}
                                            title="Deletar"
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
                <RouteFormModal
                    open={isFormModalOpen}
                    onOpenChange={setIsFormModalOpen}
                    routeId={editingRouteId}
                    onSuccess={handleFormSuccess}
                />
            </div>
        </AdminLayout>
    );
}
