import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

import { routeService, stopService } from '@/services/route.service';
import type { Stop, Route } from '@/@types/route';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { SortableList, RouteMap, LocationSearch } from '@/components/common';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

type RouteFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    routeId?: number;
    onSuccess: () => void;
};

type StopItem = Stop & {
    isNew?: boolean;
    isDeleting?: boolean;
};

const routeSchema = z.object({
    route_name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(255, 'Nome deve ter no máximo 255 caracteres'),
    description: z.string().optional(),
});

type RouteFormData = z.infer<typeof routeSchema>;

export function RouteFormModal({
    open,
    onOpenChange,
    routeId,
    onSuccess,
}: RouteFormModalProps) {
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [stops, setStops] = useState<StopItem[]>([]);
    const [newStopName, setNewStopName] = useState('');
    const [newStopLatitude, setNewStopLatitude] = useState('');
    const [newStopLongitude, setNewStopLongitude] = useState('');
    const [addingStop, setAddingStop] = useState(false);
    const [savedRouteId, setSavedRouteId] = useState<number | undefined>(routeId);
    const [tempLocation, setTempLocation] = useState<{
        lat: number;
        lon: number;
        name: string;
    } | undefined>();

    const isEditMode = !!routeId;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RouteFormData>({
        resolver: zodResolver(routeSchema),
        defaultValues: {
            route_name: '',
            description: '',
        },
    });

    useEffect(() => {
        if (open && routeId) {
            loadRoute(routeId);
        } else if (open) {
            resetForm();
        }
    }, [open, routeId]);

    async function loadRoute(id: number) {
        try {
            setLoadingRoute(true);
            const route = await routeService.getById(id);
            reset({
                route_name: route.route_name,
                description: route.description,
            });
            setStops(route.stops || []);
            setSavedRouteId(id);
        } catch (err) {
            console.error('Error loading route:', err);
            toast.error('Erro ao carregar rota', {
                description: 'Não foi possível carregar os dados da rota.',
            });
        } finally {
            setLoadingRoute(false);
        }
    }

    function resetForm() {
        reset({
            route_name: '',
            description: '',
        });
        setStops([]);
        setNewStopName('');
        setNewStopLatitude('');
        setNewStopLongitude('');
        setSavedRouteId(undefined);
        setTempLocation(undefined);
    }

    async function handleSaveRoute(data: RouteFormData) {
        try {
            let route: Route;

            if (savedRouteId) {
                route = await routeService.update(savedRouteId, data);
                toast.success('Rota atualizada!', {
                    description: 'Os dados da rota foram atualizados.',
                });
            } else {
                route = await routeService.create({
                    route_name: data.route_name,
                    description: data.description || '',
                });
                setSavedRouteId(route.id);
                toast.success('Rota criada!', {
                    description: 'Agora você pode adicionar paradas.',
                });
            }
        } catch (err: any) {
            console.error('Error saving route:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível salvar a rota.';
            toast.error('Erro ao salvar rota', {
                description: errorMessage,
            });
        }
    }

    async function handleAddStop() {
        if (!newStopName.trim()) {
            toast.error('Nome obrigatório', {
                description: 'Digite um nome para a parada',
            });
            return;
        }

        if (!savedRouteId) {
            toast.error('Salve a rota primeiro', {
                description: 'Você precisa salvar a rota antes de adicionar paradas.',
            });
            return;
        }

        try {
            setAddingStop(true);
            const newStop = await stopService.create({
                route_id: savedRouteId,
                stop_name: newStopName.trim(),
                latitude: newStopLatitude.trim() || undefined,
                longitude: newStopLongitude.trim() || undefined,
            });

            setStops(prev => [...prev, newStop]);
            setNewStopName('');
            setNewStopLatitude('');
            setNewStopLongitude('');
            setTempLocation(undefined);

            toast.success('Parada adicionada!', {
                description: 'A parada foi adicionada à rota.',
            });
        } catch (err: any) {
            console.error('Error adding stop:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível adicionar a parada.';
            toast.error('Erro ao adicionar parada', {
                description: errorMessage,
            });
        } finally {
            setAddingStop(false);
        }
    }

    async function handleRemoveStop(id: string | number) {
        const stopId = typeof id === 'string' ? parseInt(id, 10) : id;
        const stop = stops.find(s => s.id === stopId);

        if (!stop) return;

        if (!confirm(`Tem certeza que deseja remover a parada "${stop.stop_name}"?`)) {
            return;
        }

        try {
            setStops(prev => prev.map(s =>
                s.id === stopId ? { ...s, isDeleting: true } : s
            ));

            await stopService.delete(stopId);

            // Remove a parada e reordena as restantes
            const updatedStops = stops
                .filter(s => s.id !== stopId)
                .map((stop, index) => ({
                    ...stop,
                    order: index + 1,
                }));

            setStops(updatedStops);

            // Atualiza a ordem no backend
            if (updatedStops.length > 0) {
                const orderData = {
                    stops: updatedStops.map((stop) => ({
                        stop_id: stop.id,
                        order: stop.order,
                    })),
                };
                await stopService.updateOrder(orderData);
            }

            toast.success('Parada removida!', {
                description: 'A parada foi removida e a ordem foi atualizada.',
            });
        } catch (err: any) {
            console.error('Error removing stop:', err);
            setStops(prev => prev.map(s =>
                s.id === stopId ? { ...s, isDeleting: false } : s
            ));

            const errorMessage = err.response?.data?.message || 'Não foi possível remover a parada.';
            toast.error('Erro ao remover parada', {
                description: errorMessage,
            });
        }
    }

    async function handleReorderStops(reorderedStops: StopItem[]) {
        setStops(reorderedStops);

        try {
            const orderData = {
                stops: reorderedStops.map((stop, index) => ({
                    stop_id: stop.id,
                    order: index + 1,
                })),
            };

            await stopService.updateOrder(orderData);

            toast.success('Ordem atualizada!', {
                description: 'A ordem das paradas foi atualizada.',
            });
        } catch (err: any) {
            console.error('Error updating stop order:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível atualizar a ordem.';
            toast.error('Erro ao atualizar ordem', {
                description: errorMessage,
            });
        }
    }

    function handleClose() {
        if (!isSubmitting && !addingStop) {
            onOpenChange(false);
            setTimeout(() => {
                resetForm();
            }, 200);
        }
    }

    function handleFinish() {
        if (stops.length === 0) {
            toast.error('Adicione paradas', {
                description: 'A rota precisa ter pelo menos uma parada.',
            });
            return;
        }

        onSuccess();
        handleClose();
    }

    function handleLocationSelect(location: { lat: number; lon: number; name: string }) {
        setNewStopLatitude(location.lat.toString());
        setNewStopLongitude(location.lon.toString());
        setTempLocation(location);
    }

    function handleMapClick(lat: number, lon: number) {
        setNewStopLatitude(lat.toFixed(6));
        setNewStopLongitude(lon.toFixed(6));
        setTempLocation({
            lat,
            lon,
            name: newStopName || 'Nova parada',
        });
    }

    function renderStop(stop: StopItem) {
        return (
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium text-gray-900">{stop.stop_name}</h4>
                    <div className="flex gap-3 text-sm text-gray-500">
                        <span>Ordem: {stop.order}</span>
                        {stop.latitude && stop.longitude && (
                            <span>• Lat: {stop.latitude}, Long: {stop.longitude}</span>
                        )}
                    </div>
                </div>
                {stop.isDeleting && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                )}
            </div>
        );
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-h-[95vh] overflow-hidden w-full !max-w-[95vw]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Editar Rota' : 'Nova Rota'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Atualize as informações da rota e gerencie as paradas.'
                            : 'Preencha os dados da rota e adicione as paradas.'
                        }
                    </DialogDescription>
                </DialogHeader>

                {loadingRoute ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(95vh-180px)] overflow-y-auto">
                        {/* Coluna Esquerda - Formulário */}
                        <div className="space-y-6 pr-4">
                            <Accordion type="multiple" defaultValue={["route-info", "stops"]} className="w-full">
                                {/* Informações da Rota */}
                                <AccordionItem value="route-info">
                                    <AccordionTrigger>
                                        <span className="text-sm font-semibold text-gray-900">
                                            Informações da Rota
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <form onSubmit={handleSubmit(handleSaveRoute)} className="space-y-4">
                                            <Input
                                                label="Nome da Rota"
                                                placeholder="Ex: Rota Central"
                                                {...register('route_name')}
                                                error={errors.route_name?.message}
                                                disabled={isSubmitting}
                                            />

                                            <Textarea
                                                label="Descrição"
                                                placeholder="Descreva a rota..."
                                                {...register('description')}
                                                error={errors.description?.message}
                                                rows={3}
                                                disabled={isSubmitting}
                                            />

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full"
                                            >
                                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                {savedRouteId ? 'Atualizar Rota' : 'Salvar Rota'}
                                            </Button>
                                        </form>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Paradas */}
                                {savedRouteId && (
                                    <AccordionItem value="stops">
                                        <AccordionTrigger>
                                            <span className="text-sm font-semibold text-gray-900">
                                                Paradas {stops.length > 0 && `(${stops.length})`}
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-6">
                                                {/* Adicionar Parada */}
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-medium text-gray-700">
                                                        Adicionar Nova Parada
                                                    </h4>

                                                    <div className="space-y-3">
                                                        <LocationSearch
                                                            value={newStopName}
                                                            onChange={setNewStopName}
                                                            onLocationSelect={handleLocationSelect}
                                                            disabled={addingStop}
                                                            label="Nome da Parada"
                                                            placeholder="Ex: Ponto Central ou Rua das Flores"
                                                        />

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <Input
                                                                label="Latitude"
                                                                name="latitude"
                                                                value={newStopLatitude}
                                                                onChange={(e) => setNewStopLatitude(e.target.value)}
                                                                placeholder="Ex: -23.5505"
                                                                disabled={addingStop}
                                                            />
                                                            <Input
                                                                label="Longitude"
                                                                name="longitude"
                                                                value={newStopLongitude}
                                                                onChange={(e) => setNewStopLongitude(e.target.value)}
                                                                placeholder="Ex: -46.6333"
                                                                disabled={addingStop}
                                                            />
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            onClick={handleAddStop}
                                                            disabled={addingStop || !newStopName.trim()}
                                                            className="w-full"
                                                        >
                                                            {addingStop ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                    Adicionando...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Plus className="w-4 h-4 mr-2" />
                                                                    Adicionar Parada
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Lista de Paradas */}
                                                {stops.length > 0 && (
                                                    <div className="space-y-4 pt-4 border-t">
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-700">
                                                                Lista de Paradas
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                Arraste para reordenar as paradas
                                                            </p>
                                                        </div>

                                                        <SortableList
                                                            items={stops}
                                                            onReorder={handleReorderStops}
                                                            onRemove={handleRemoveStop}
                                                            renderItem={renderStop}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                )}
                            </Accordion>
                        </div>

                        {/* Coluna Direita - Mapa */}
                        <div className="space-y-4">
                            <div className="sticky top-0">
                                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                    Visualização do Mapa
                                </h3>
                                {savedRouteId ? (
                                    <RouteMap
                                        stops={stops}
                                        tempLocation={tempLocation}
                                        onMapClick={handleMapClick}
                                        height="calc(95vh - 280px)"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center border border-dashed border-gray-300 rounded-lg bg-gray-50 h-[calc(95vh-280px)]">
                                        <div className="text-center p-6">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg
                                                    className="w-8 h-8 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Salve a rota primeiro para visualizar o mapa
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                {!loadingRoute && (
                    <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isSubmitting || addingStop}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleFinish}
                            disabled={isSubmitting || addingStop || !savedRouteId || stops.length === 0}
                        >
                            Concluir
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
