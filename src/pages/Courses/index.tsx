import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Link } from 'lucide-react';
import { toast } from 'sonner';

import { courseService } from '@/services/course.service';
import { AdminLayout } from '@/components/layout';
import { Button } from '@/components/Button';
import { CourseFormModal } from '@/components/Courses/CourseFormModal';
import { LinkInstitutionsModal } from '@/components/Courses/LinkInstitutionsModal';
import { courseTypeLabels } from '@/enums/courseType';
import {
    PageHeader,
    SearchBar,
    EmptyState,
    DataTable,
    TablePagination,
    type PaginationMeta
} from '@/components/common';

export default function CourseList() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<CourseFilters>({
        per_page: 15,
        page: 1,
    });
    const [pagination, setPagination] = useState<PaginationMeta>();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingCourseId, setEditingCourseId] = useState<number | undefined>(undefined);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkingCourseId, setLinkingCourseId] = useState<number | undefined>(undefined);

    useEffect(() => {
        loadCourses();
    }, [filters]);

    async function loadCourses() {
        try {
            setLoading(true);
            setError(null);
            const response = await courseService.getAll(filters);
            setCourses(response.data);
            setPagination(response.meta);
        } catch (err) {
            setError('Erro ao carregar cursos. Tente novamente.');
            console.error('Error loading courses:', err);
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
        setEditingCourseId(undefined);
        setIsFormModalOpen(true);
    }

    function handleOpenLinkModal(id: number) {
        setLinkingCourseId(id);
        setIsLinkModalOpen(true);
    }

    function handleOpenEditModal(id: number) {
        setEditingCourseId(id);
        setIsFormModalOpen(true);
    }

    async function handleDelete(id: number, name: string) {
        if (!confirm(`Tem certeza que deseja remover o curso "${name}"?`)) {
            return;
        }

        try {
            await courseService.delete(id);
            toast.success('Curso removido!', {
                description: 'O curso foi removido com sucesso.',
            });
            loadCourses();
        } catch (err: any) {
            console.error('Error deleting course:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível remover o curso. Tente novamente.';
            toast.error('Erro ao remover curso', {
                description: errorMessage,
            });
        }
    }

    function handleFormSuccess() {
        loadCourses();
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

    function getCourseTypeLabel(courseType: string): string {
        return courseTypeLabels[courseType as keyof typeof courseTypeLabels] || courseType;
    }

    const hasData = !loading && !error && courses.length > 0;
    const isEmpty = !loading && !error && courses.length === 0;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <PageHeader
                    title="Cursos"
                    description="Gerencie os cursos do sistema"
                    action={{
                        label: 'Novo Curso',
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
                        placeholder="Buscar por nome..."
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
                                title="Nenhum curso encontrado"
                                description="Comece adicionando um novo curso ao sistema"
                                action={{
                                    label: 'Adicionar Curso',
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
                        <DataTable.Head>Tipo</DataTable.Head>
                        <DataTable.Head>Descrição</DataTable.Head>
                        <DataTable.Head>Criado em</DataTable.Head>
                        <DataTable.Head className="text-right">Ações</DataTable.Head>
                    </DataTable.Header>
                    <DataTable.Body>
                        {courses.map((course, index) => (
                            <DataTable.Row key={course.id}>
                                <DataTable.Cell className="font-medium">
                                    {pagination ? pagination.from + index : index + 1}
                                </DataTable.Cell>
                                <DataTable.Cell className="font-medium">
                                    {course.name}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {getCourseTypeLabel(course.course_type)}
                                </DataTable.Cell>
                                <DataTable.Cell className='truncate max-w-sm'>
                                    {course.description || '-'}
                                </DataTable.Cell>
                                <DataTable.Cell>
                                    {new Date(course.created_at).toLocaleDateString('pt-BR')}
                                </DataTable.Cell>
                                <DataTable.Cell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleOpenLinkModal(course.id)}
                                            title="Vincular Instituições"
                                        >
                                            <Link className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon-md"
                                            onClick={() => handleOpenEditModal(course.id)}
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon-md"
                                            onClick={() => handleDelete(course.id, course.name)}
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
                <CourseFormModal
                    open={isFormModalOpen}
                    onOpenChange={setIsFormModalOpen}
                    courseId={editingCourseId}
                    onSuccess={handleFormSuccess}
                />

                {linkingCourseId && (
                    <LinkInstitutionsModal
                        open={isLinkModalOpen}
                        onOpenChange={setIsLinkModalOpen}
                        courseId={linkingCourseId}
                        onSuccess={() => { }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
