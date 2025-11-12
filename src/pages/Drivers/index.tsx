import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { vehicleService } from '@/services/vehicle.service';
import { AdminLayout } from '@/components/layout';
import { Button } from '@/components/Button';
import { VehicleFormModal } from '@/components/Vehicles/VehicleFormModal';
import {
    PageHeader,
    SearchBar,
    EmptyState,
    DataTable,
    TablePagination,
    type PaginationMeta
} from '@/components/common';

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<DefaultFilters>({
        per_page: 10,
        page: 1,
    });
    const [pagination, setPagination] = useState<PaginationMeta>();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingVehicleId, setEditingVehicleId] = useState<number | undefined>(undefined);

    useEffect(() => {
        loadDrivers();
    }, [filters]);

    async function loadDrivers() {
        try {
            setLoading(true);
            setError(null);
            const response = await vehicleService.getAll(filters);
            setDrivers(response.data);
            setPagination(response.meta);
        } catch (err) {
            setError('Erro ao carregar motoristas. Tente novamente.');
            console.error('Error loading drivers:', err);
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

    async function handleDelete(id: number) {
        if (!confirm('Tem certeza que deseja excluir este veículo?')) {
            return;
        }

        try {
            await vehicleService.delete(id);
            toast.success('Veículo excluído!', {
                description: 'O veículo foi excluído com sucesso.',
            });
            loadDrivers();
        } catch (err) {
            console.error('Error deleting vehicle:', err);
            toast.error('Erro ao excluir veículo', {
                description: 'Não foi possível excluir o veículo. Tente novamente.',
            });
        }
    }

    function handleOpenCreateModal() {
        setEditingVehicleId(undefined);
        setIsFormModalOpen(true);
    }

    function handleOpenEditModal(id: number) {
        setEditingVehicleId(id);
        setIsFormModalOpen(true);
    }

    function handleFormSuccess() {
        loadDrivers();
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

    const hasData = !loading && !error && drivers.length > 0;
    const isEmpty = !loading && !error && drivers.length === 0;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <PageHeader
                    title="Veículos"
                    description="Gerencie a frota de veículos"
                    action={{
                        label: 'Novo Veículo',
                        icon: <Plus className="w-4 h-4" />,
                        onClick: handleOpenCreateModal,
                    }}
                />

                {/* Filters */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSearch={handleSearch}
                    placeholder="Buscar por placa, marca ou modelo..."
                    perPage={filters.per_page}
                    onPerPageChange={handlePerPageChange}
                />

                {/* Content */}
                <DataTable
                    loading={loading}
                    error={error}
                    emptyState={
                        isEmpty ? (
                            <EmptyState
                                title="Nenhum veículo encontrado"
                                description="Comece adicionando um novo veículo à frota"
                                action={{
                                    label: 'Adicionar Veículo',
                                    icon: <Plus className="w-4 h-4 mr-2" />,
                                    onClick: handleOpenCreateModal,
                                }}
                            />
                        ) : undefined
                    }
                >
                    <DataTable.Header>
                        <DataTable.Head className="w-[100px]">#</DataTable.Head>
                        <DataTable.Head>Placa</DataTable.Head>
                        <DataTable.Head>Marca/Modelo</DataTable.Head>
                        <DataTable.Head className="text-right">Capacidade</DataTable.Head>
                        <DataTable.Head className="text-right">Ações</DataTable.Head>
                    </DataTable.Header>
                    <DataTable.Body>
                        {drivers.map((driver, index) => (
                            <DataTable.Row key={driver.id}>
                                <DataTable.Cell className="font-medium">
                                    {pagination ? pagination.from + index : index + 1}
                                </DataTable.Cell>
                                <DataTable.Cell className="font-medium">
                                    {driver.license_plate}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {driver.model}
                                </DataTable.Cell>
                                <DataTable.Cell className="text-right">
                                    {driver.capacity} Passageiros
                                </DataTable.Cell>
                                <DataTable.Cell className="text-right">
                                    <div className="space-x-2">
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleOpenEditModal(driver.id)}
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleDelete(driver.id)}
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
                <VehicleFormModal
                    open={isFormModalOpen}
                    onOpenChange={setIsFormModalOpen}
                    vehicleId={editingVehicleId}
                    onSuccess={handleFormSuccess}
                />
            </div>
        </AdminLayout>
    );
}
