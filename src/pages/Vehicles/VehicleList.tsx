import { useState, useEffect } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import { vehicleService } from '@/services/vehicle.service';
import type { Vehicle, VehicleFilters, VehicleListResponse } from '@/@types';
import { AdminLayout } from '@/components/layout';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/ui/card';
import { VehicleFormModal } from '@/components/Vehicles/VehicleFormModal';
import { CustomSelect, type SelectOption } from '@/components/Select';

export default function VehicleList() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<VehicleFilters>({
        per_page: 10,
        page: 1,
    });
    const [pagination, setPagination] = useState<VehicleListResponse['meta']>();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingVehicleId, setEditingVehicleId] = useState<number | undefined>(undefined);

    const perPageOptions: SelectOption[] = [
        { value: 10, label: '10' },
        { value: 15, label: '15' },
        { value: 25, label: '25' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
    ];

    useEffect(() => {
        loadVehicles();
    }, [filters]);

    async function loadVehicles() {
        try {
            setLoading(true);
            setError(null);
            const response = await vehicleService.getAll(filters);
            setVehicles(response.data);
            setPagination(response.meta);
        } catch (err) {
            setError('Erro ao carregar veículos. Tente novamente.');
            console.error('Error loading vehicles:', err);
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
            loadVehicles();
        } catch (err) {
            alert('Erro ao excluir veículo. Tente novamente.');
            console.error('Error deleting vehicle:', err);
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
        loadVehicles();
    }

    function handlePageChange(page: number) {
        setFilters(prev => ({
            ...prev,
            page,
        }));
    }

    function getPageNumbers() {
        if (!pagination) return [];

        const { current_page, last_page } = pagination;
        const pages: (number | string)[] = [];

        pages.push(1);

        const startPage = Math.max(2, current_page - 1);
        const endPage = Math.min(last_page - 1, current_page + 1);

        if (startPage > 2) {
            pages.push('ellipsis-start');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < last_page - 1) {
            pages.push('ellipsis-end');
        }

        if (last_page > 1) {
            pages.push(last_page);
        }

        return pages;
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Veículos
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Gerencie a frota de veículos
                        </p>
                    </div>
                    <Button
                        onClick={handleOpenCreateModal}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Novo Veículo
                    </Button>
                </div>

                {/* Filters */}
                <Card className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 flex gap-2">
                            <Input
                                placeholder="Buscar por placa, marca ou modelo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                            <Button onClick={handleSearch} variant="secondary">
                                <Search className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="per-page" className="text-sm text-foreground whitespace-nowrap">
                                Por página:
                            </label>
                            <CustomSelect
                                options={perPageOptions}
                                value={filters.per_page}
                                onChange={(value) =>
                                    setFilters(prev => ({
                                        ...prev,
                                        per_page: Number(value),
                                        page: 1,
                                    }))
                                }
                                size="sm"
                                className="w-20"
                            />
                        </div>
                    </div>
                </Card>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-500">Carregando...</div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-red-500">{error}</div>
                    </div>
                ) : vehicles.length === 0 ? (
                    <Card className="p-12">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                Nenhum veículo encontrado
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Comece adicionando um novo veículo à frota
                            </p>
                            <Button onClick={handleOpenCreateModal}>
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Veículo
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">#</TableHead>
                                <TableHead>Placa</TableHead>
                                <TableHead>Marca/Modelo</TableHead>
                                <TableHead className="text-right">Capacidade</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {vehicles.map((vehicle, index) => (
                                <TableRow key={vehicle.id}>
                                    <TableCell className="font-medium">
                                        {pagination ? pagination.from + index : index + 1}
                                    </TableCell>
                                    <TableCell className="font-medium">{vehicle.license_plate}</TableCell>
                                    <TableCell>{vehicle.model}</TableCell>
                                    <TableCell className="text-right">{vehicle.capacity} Passageiros</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleOpenEditModal(vehicle.id)}
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleDelete(vehicle.id)}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Pagination */}
                {!loading && !error && vehicles.length > 0 && pagination && pagination.last_page > 1 && (
                    <Card className="p-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            {/* Pagination Controls */}
                            <Pagination>
                                <PaginationContent>
                                    {/* Previous Button */}
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (pagination.current_page > 1) {
                                                    handlePageChange(pagination.current_page - 1);
                                                }
                                            }}
                                            className={
                                                pagination.current_page === 1
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>

                                    {/* Page Numbers */}
                                    {getPageNumbers().map((page, index) => (
                                        <PaginationItem key={`${page}-${index}`}>
                                            {typeof page === 'number' ? (
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handlePageChange(page);
                                                    }}
                                                    isActive={pagination.current_page === page}
                                                    className="cursor-pointer"
                                                >
                                                    {page}
                                                </PaginationLink>
                                            ) : (
                                                <PaginationEllipsis />
                                            )}
                                        </PaginationItem>
                                    ))}

                                    {/* Next Button */}
                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if (pagination.current_page < pagination.last_page) {
                                                    handlePageChange(pagination.current_page + 1);
                                                }
                                            }}
                                            className={
                                                pagination.current_page === pagination.last_page
                                                    ? 'pointer-events-none opacity-50'
                                                    : 'cursor-pointer'
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </Card>
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
