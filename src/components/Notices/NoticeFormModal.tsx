import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CustomSelect } from '@/components/Select';
import { Textarea } from '@/components/Textarea';
import { createNotice } from '@/services/notice.service';
import { routeService } from '@/services/route.service';

import type { Route } from '@/@types/route';

type NoticeFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
};

const noticeSchema = z.object({
    title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(255, 'Título deve ter no máximo 255 caracteres'),
    content: z.string().min(10, 'Conteúdo deve ter pelo menos 10 caracteres'),
    type: z.enum(['general', 'route_alert'] as const, {
        errorMap: () => ({ message: 'Selecione um tipo de aviso' }),
    }),
    route_ids: z.array(z.number()).optional(),
});

type NoticeFormData = z.infer<typeof noticeSchema>;

const noticeTypeOptions = [
    { value: 'general', label: 'Geral' },
    { value: 'route_alert', label: 'Alerta de Rota' },
];

export function NoticeFormModal({ open, onOpenChange, onSuccess }: NoticeFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loadingRoutes, setLoadingRoutes] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors },
    } = useForm<NoticeFormData>({
        resolver: zodResolver(noticeSchema),
        defaultValues: {
            title: '',
            content: '',
            type: 'general',
            route_ids: [],
        },
    });

    const selectedType = watch('type');

    useEffect(() => {
        if (open) {
            loadRoutes();
        }
    }, [open]);

    async function loadRoutes() {
        try {
            setLoadingRoutes(true);
            const response = await routeService.getAll();
            setRoutes(response.data);
        } catch (error) {
            console.error('Erro ao carregar rotas:', error);
            toast.error('Erro ao carregar rotas');
        } finally {
            setLoadingRoutes(false);
        }
    }

    async function onSubmit(data: NoticeFormData) {
        try {
            setLoading(true);

            const payload = {
                title: data.title,
                content: data.content,
                type: data.type,
                route_ids: data.type === 'route_alert' && data.route_ids && data.route_ids.length > 0
                    ? data.route_ids
                    : null,
            };

            await createNotice(payload);

            toast.success('Aviso criado com sucesso!');
            onSuccess();
            handleClose();
        } catch (error: any) {
            console.error('Erro ao criar aviso:', error);
            toast.error(error.response?.data?.message || 'Erro ao criar aviso');
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        reset();
        onOpenChange(false);
    }

    const routeOptions = routes.map(route => ({
        value: route.id.toString(),
        label: route.route_name,
    }));

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Criar Novo Aviso</DialogTitle>
                        <button
                            onClick={handleClose}
                            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Fechar</span>
                        </button>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <Input
                        label="Título"
                        placeholder="Digite o título do aviso"
                        error={errors.title?.message}
                        {...register('title')}
                    />

                    <Textarea
                        label="Conteúdo"
                        placeholder="Digite o conteúdo do aviso"
                        error={errors.content?.message}
                        rows={4}
                        {...register('content')}
                    />

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Tipo de Aviso
                        </label>
                        <Controller
                            name="type"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    options={noticeTypeOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Selecione o tipo"
                                />
                            )}
                        />
                        {errors.type?.message && (
                            <p className="mt-1 text-xs text-error-600">{errors.type.message}</p>
                        )}
                    </div>

                    {selectedType === 'route_alert' && (
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                                Rotas (opcional)
                            </label>
                            <p className="text-xs text-gray-500 mb-2">
                                Para enviar o aviso para múltiplas rotas, crie avisos separados para cada rota.
                            </p>
                            <Controller
                                name="route_ids"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        options={routeOptions}
                                        value={field.value?.[0]?.toString()}
                                        onChange={(value) => {
                                            field.onChange([Number(value)]);
                                        }}
                                        placeholder={loadingRoutes ? "Carregando rotas..." : "Selecione uma rota"}
                                        disabled={loadingRoutes}
                                    />
                                )}
                            />
                            {errors.route_ids?.message && (
                                <p className="mt-1 text-xs text-error-600">{errors.route_ids.message}</p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            {loading ? "Criando..." : "Criar Aviso"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
