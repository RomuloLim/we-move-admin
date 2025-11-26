import { useState, useEffect } from 'react';
import { Plus, Pencil } from 'lucide-react';

import { userService } from '@/services/user.service';
import { AdminLayout } from '@/components/layout';
import { Button } from '@/components/Button';
import { UserFormModal } from '@/components/Users/UserFormModal';
import { CustomSelect } from '@/components/Select';
import {
    PageHeader,
    SearchBar,
    EmptyState,
    DataTable,
    TablePagination,
} from '@/components/common';

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<UserFilters>({
        per_page: 15,
        page: 1,
    });
    const [pagination, setPagination] = useState<PaginationMeta>();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState<number | undefined>(undefined);

    useEffect(() => {
        loadUsers();
    }, [filters]);

    async function loadUsers() {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getAll(filters);
            setUsers(response.data);
            setPagination(response.meta);
        } catch (err) {
            setError('Erro ao carregar usuários. Tente novamente.');
            console.error('Error loading users:', err);
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

    function handleUserTypeChange(value: string) {
        setFilters(prev => ({
            ...prev,
            type: value === 'all' ? undefined : (value as UserType),
            page: 1,
        }));
    }

    function handleOpenCreateModal() {
        setEditingUserId(undefined);
        setIsFormModalOpen(true);
    }

    function handleOpenEditModal(id: number) {
        setEditingUserId(id);
        setIsFormModalOpen(true);
    }

    function handleFormSuccess() {
        loadUsers();
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

    function getUserTypeBadgeColor(userType: string) {
        const colors: Record<string, string> = {
            'super-admin': 'bg-primary text-amber-50',
            'admin': 'bg-blue-700 text-blue-200',
            'driver': 'bg-green-700 text-green-200',
            'student': 'bg-gray-700 text-gray-200',
        };
        return colors[userType] || colors.student;
    }

    const userTypeOptions = [
        { value: 'all', label: 'Todos os tipos' },
        { value: 'super-admin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'driver', label: 'Motorista' },
        { value: 'student', label: 'Estudante' },
    ];

    const hasData = !loading && !error && users.length > 0;
    const isEmpty = !loading && !error && users.length === 0;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <PageHeader
                    title="Usuários"
                    description="Gerencie os usuários do sistema"
                    action={{
                        label: 'Novo Usuário',
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
                        placeholder="Buscar por nome ou email..."
                        perPage={filters.per_page}
                        onPerPageChange={handlePerPageChange}
                        customElements={(
                            <div className="flex items-center gap-4">
                                <CustomSelect
                                    options={userTypeOptions}
                                    value={filters.type || 'all'}
                                    onChange={handleUserTypeChange}
                                    placeholder="Selecione um tipo"
                                    className="w-[200px]"
                                />
                            </div>
                        )}
                    />
                </div>

                {/* Content */}
                <DataTable
                    loading={loading}
                    error={error}
                    emptyState={
                        isEmpty ? (
                            <EmptyState
                                title="Nenhum usuário encontrado"
                                description="Comece adicionando um novo usuário ao sistema"
                                action={{
                                    label: 'Adicionar Usuário',
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
                        <DataTable.Head>E-mail</DataTable.Head>
                        <DataTable.Head>Tipo</DataTable.Head>
                        <DataTable.Head>Criado em</DataTable.Head>
                        <DataTable.Head className="text-right">Ações</DataTable.Head>
                    </DataTable.Header>
                    <DataTable.Body>
                        {users.map((user, index) => (
                            <DataTable.Row key={user.id}>
                                <DataTable.Cell className="font-medium">
                                    {pagination ? pagination.from + index : index + 1}
                                </DataTable.Cell>
                                <DataTable.Cell className="font-medium">
                                    {user.name}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {user.email}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUserTypeBadgeColor(user.user_type)}`}
                                    >
                                        {user.user_type_label}
                                    </span>
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                </DataTable.Cell>
                                <DataTable.Cell className="text-right">
                                    <Button
                                        variant="secondary"
                                        size="icon-md"
                                        onClick={() => handleOpenEditModal(user.id)}
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </Button>
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
                <UserFormModal
                    open={isFormModalOpen}
                    onOpenChange={setIsFormModalOpen}
                    userId={editingUserId}
                    onSuccess={handleFormSuccess}
                />
            </div>
        </AdminLayout>
    );
}
