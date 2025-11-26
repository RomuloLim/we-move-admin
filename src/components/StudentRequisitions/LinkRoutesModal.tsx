import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Check, MapPin, Clock } from 'lucide-react';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { userRouteService } from '@/services/userRoute.service';
import { cn } from '@/lib/utils';
import type { UserRoute } from '@/@types/route';

type LinkRoutesModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId: number;
    onSuccess: () => void;
};

export function LinkRoutesModal({ open, onOpenChange, userId, onSuccess }: LinkRoutesModalProps) {
    const [loading, setLoading] = useState(false);
    const [routes, setRoutes] = useState<UserRoute[]>([]);
    const [linkedRouteIds, setLinkedRouteIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && userId) {
            resetAndLoadData();
        } else {
            resetState();
        }
    }, [open, userId]);

    function resetState() {
        setRoutes([]);
        setLinkedRouteIds([]);
        setSearchTerm('');
        setPage(1);
        setHasMore(true);
    }

    async function resetAndLoadData() {
        setRoutes([]);
        setLinkedRouteIds([]);
        setPage(1);
        setHasMore(true);
        await loadData(1, true);
    }

    async function loadData(pageNumber: number = page, isInitial: boolean = false) {
        if (loading) return;

        try {
            setLoading(true);
            const response = await userRouteService.getAllOrderedByUser(userId, pageNumber);

            const newRoutes = response.data;

            if (isInitial) {
                setRoutes(newRoutes);
                const linkedIds = newRoutes.filter(r => r.is_linked).map(r => r.id);
                setLinkedRouteIds(linkedIds);
            } else {
                setRoutes(prev => [...prev, ...newRoutes]);
            }

            setHasMore(response.links.next !== null);
            setPage(pageNumber);

        } catch (err) {
            console.error('Error loading routes:', err);
            toast.error('Erro ao carregar rotas');
        } finally {
            setLoading(false);
        }
    }

    const loadMore = useCallback(() => {
        if (hasMore && !loading) {
            loadData(page + 1);
        }
    }, [hasMore, loading, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 1.0 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [loadMore, hasMore, loading]);

    function toggleRoute(routeId: number) {
        setLinkedRouteIds(prev => {
            if (prev.includes(routeId)) {
                return prev.filter(id => id !== routeId);
            } else {
                return [...prev, routeId];
            }
        });
    }

    async function handleSave() {
        try {
            setLoading(true);

            // Calculate changes based on is_linked property
            const toLink = linkedRouteIds.filter(id => {
                const route = routes.find(r => r.id === id);
                return route && !route.is_linked;
            });

            const toUnlink = routes
                .filter(r => r.is_linked && !linkedRouteIds.includes(r.id))
                .map(r => r.id);

            const promises = [];

            if (toLink.length > 0) {
                promises.push(userRouteService.linkRoutes({
                    user_id: userId,
                    route_ids: toLink
                }));
            }

            if (toUnlink.length > 0) {
                promises.push(userRouteService.unlinkRoutes({
                    user_id: userId,
                    route_ids: toUnlink
                }));
            }

            if (promises.length > 0) {
                await Promise.all(promises);
                toast.success('Vínculos atualizados com sucesso!');
            }

            onSuccess();
            onOpenChange(false);

        } catch (err: any) {
            console.error('Error saving route links:', err);
            const errorMessage = err.response?.data?.message || 'Erro ao salvar vínculos';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const filteredRoutes = routes.filter(route =>
        route.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Vincular Rotas ao Estudante</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar rotas..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-1">
                        {loading && routes.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
                        ) : filteredRoutes.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">Nenhuma rota encontrada.</div>
                        ) : (
                            <>
                                {filteredRoutes.map(route => {
                                    const isSelected = linkedRouteIds.includes(route.id);
                                    return (
                                        <div
                                            key={route.id}
                                            className={cn(
                                                "flex items-start justify-between p-3 rounded-md cursor-pointer transition-colors border",
                                                isSelected
                                                    ? "bg-primary/5 border-primary/20"
                                                    : "hover:bg-muted border-transparent"
                                            )}
                                            onClick={() => toggleRoute(route.id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium">{route.route_name}</div>
                                                {route.description && (
                                                    <div className="text-sm text-muted-foreground line-clamp-1">
                                                        {route.description}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        <span>{route.stops_amount} paradas</span>
                                                    </div>
                                                    {route.first_stop && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{route.first_stop.scheduled_time}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {route.first_stop && route.last_stop && (
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {route.first_stop.stop_name} → {route.last_stop.stop_name}
                                                    </div>
                                                )}
                                            </div>
                                            {isSelected && (
                                                <Check className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                                            )}
                                        </div>
                                    );
                                })}
                                {hasMore && (
                                    <div ref={observerTarget} className="p-4 text-center">
                                        {loading && <div className="text-muted-foreground">Carregando mais...</div>}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="text-sm text-muted-foreground text-right">
                        {linkedRouteIds.length} rota(s) selecionada(s)
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
