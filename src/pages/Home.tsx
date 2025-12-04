import { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { AdminLayout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, CheckCircle, Eye, Trash, Clock, Plus, Calendar } from "lucide-react";
import { toast } from "sonner";
import { NoticeFormModal } from "@/components/Notices/NoticeFormModal";
import { getNotices, deleteNotice } from "@/services/notice.service";
import { studentRequisitionService } from "@/services/studentRequisition.service";
import { TablePagination } from "@/components/common";
import type { Notice } from "@/@types/notice";
import type { StudentRequisition } from "@/@types/studentRequisition";

export default function Home() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [loadingNotices, setLoadingNotices] = useState(false);
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
    const [deletingNoticeId, setDeletingNoticeId] = useState<number | null>(null);
    const [pagination, setPagination] = useState<PaginationMeta>();
    const [currentPage, setCurrentPage] = useState(1);
    const [recentRequisitions, setRecentRequisitions] = useState<StudentRequisition[]>([]);
    const [loadingRequisitions, setLoadingRequisitions] = useState(false);

    const stats = [
        {
            title: "Total de Estudantes",
            value: "25",
            change: "",
            icon: Users,
            description: "Estudantes com requisição ativa"
        },
        {
            title: "Requisições Pendentes",
            value: "9",
            change: "",
            icon: Clock,
            description: "Estudantes com requisição pendente"
        },
        {
            title: "Rotas Ativas",
            value: "0/1",
            icon: MapPin,
            description: "em operação atualmente"
        },
        {
            title: "Rotas finalizadas",
            value: "1",
            change: "",
            icon: CheckCircle,
            description: "Viagens Concluídas Hoje"
        },
    ];

    useEffect(() => {
        loadNotices();
        loadRecentRequisitions();
    }, []);

    async function loadNotices(page: number = 1) {
        try {
            setLoadingNotices(true);
            const response = await getNotices(page);
            setNotices(response.data);
            setPagination(response.meta);
            setCurrentPage(page);
        } catch (error) {
            console.error('Erro ao carregar avisos:', error);
            toast.error('Erro ao carregar avisos');
        } finally {
            setLoadingNotices(false);
        }
    }

    async function loadRecentRequisitions() {
        try {
            setLoadingRequisitions(true);
            const response = await studentRequisitionService.getAll({
                per_page: 4,
                status: 'pending'
            });
            setRecentRequisitions(response.data.slice(0, 4));
        } catch (error) {
            console.error('Erro ao carregar solicitações recentes:', error);
            toast.error('Erro ao carregar solicitações recentes');
        } finally {
            setLoadingRequisitions(false);
        }
    }

    async function handleDeleteNotice(id: number) {
        try {
            setDeletingNoticeId(id);
            await deleteNotice(id);
            toast.success('Aviso removido com sucesso!');
            loadNotices(currentPage);
        } catch (error: any) {
            console.error('Erro ao remover aviso:', error);
            toast.error(error.response?.data?.message || 'Erro ao remover aviso');
        } finally {
            setDeletingNoticeId(null);
        }
    }

    function handleNoticeSuccess() {
        loadNotices(1);
    }

    function handlePageChange(page: number) {
        loadNotices(page);
    }

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bem-vindo de volta!</h2>
                    <p className="text-muted-foreground">
                        Aqui está o seu resumo de hoje
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        <span className="text-success-600 font-medium">{stat.change}</span> {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-7">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Avisos ativos</CardTitle>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => setIsNoticeModalOpen(true)}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Novo
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {loadingNotices ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, index) => (
                                        <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-3 w-full" />
                                            </div>
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            ) : notices.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nenhum aviso ativo no momento
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notices.map((notice) => (
                                        <div key={notice.id} className="flex items-center gap-4 rounded-lg border p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <Calendar className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium">
                                                    {notice.title}
                                                    <span className="text-xs text-muted-foreground ml-2">
                                                        ({notice.type_label})
                                                    </span>
                                                </p>
                                                <p className="text-xs text-muted-foreground">{notice.content}</p>
                                            </div>

                                            <Button
                                                size="icon-sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteNotice(notice.id)}
                                                disabled={deletingNoticeId !== null}
                                            >
                                                {deletingNoticeId === notice.id ? "..." : <Trash />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            {pagination && pagination.last_page > 1 && (
                                <div className="w-full">
                                    <TablePagination
                                        pagination={pagination}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            )}
                        </CardFooter>
                    </Card>

                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Solicitações Recentes</CardTitle>
                            <CardDescription>
                                Últimas solicitações realizadas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingRequisitions ? (
                                <div className="space-y-4">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="flex items-center gap-4 rounded-lg border p-4">
                                            <Skeleton className="h-10 w-10 rounded-full" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-3/4" />
                                                <Skeleton className="h-3 w-full" />
                                            </div>
                                            <Skeleton className="h-8 w-8 rounded-md" />
                                        </div>
                                    ))}
                                </div>
                            ) : recentRequisitions.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Nenhuma solicitação recente
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {recentRequisitions.map((requisition) => (
                                        <div key={requisition.id} className="flex items-center gap-4 rounded-lg border p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <Users className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium">
                                                    {requisition.student?.user?.name || 'Nome não disponível'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {requisition.institution_course?.course?.name || 'Curso não disponível'}
                                                </p>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                <Button size="icon-sm" variant="primary">
                                                    <Eye />
                                                </Button>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Rotas Ativas</CardTitle>
                            <CardDescription>
                                Rotas ativas no momento e quantidade de estudantes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                                            1
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Rota 08</p>
                                            <p className="text-xs text-muted-foreground">15 alunos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium">45%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <NoticeFormModal
                open={isNoticeModalOpen}
                onOpenChange={setIsNoticeModalOpen}
                onSuccess={handleNoticeSuccess}
            />
        </AdminLayout>
    );
}
