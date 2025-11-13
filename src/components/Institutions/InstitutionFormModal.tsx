import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { institutionService } from '@/services/institution.service';

type InstitutionFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    institutionId?: number;
    onSuccess: () => void;
};

const createInstitutionSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório'),
    zip_code: z.string().min(8, 'CEP inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
    email: z.string().email('E-mail inválido'),
    website: z.string().url('URL inválida').optional().or(z.literal('')),
});

const editInstitutionSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
    address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres').optional(),
    city: z.string().min(2, 'Cidade é obrigatória').optional(),
    state: z.string().min(2, 'Estado é obrigatório').optional(),
    zip_code: z.string().min(8, 'CEP inválido').optional(),
    phone: z.string().min(10, 'Telefone inválido').optional(),
    email: z.string().email('E-mail inválido').optional(),
    website: z.string().url('URL inválida').optional().or(z.literal('')),
});

type CreateInstitutionFormData = z.infer<typeof createInstitutionSchema>;
type EditInstitutionFormData = z.infer<typeof editInstitutionSchema>;

export function InstitutionFormModal({ open, onOpenChange, institutionId, onSuccess }: InstitutionFormModalProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!institutionId;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
    } = useForm<CreateInstitutionFormData | EditInstitutionFormData>({
        resolver: zodResolver(isEditing ? editInstitutionSchema : createInstitutionSchema),
        defaultValues: {
            name: '',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            phone: '',
            email: '',
            website: '',
        },
    });

    useEffect(() => {
        if (open && institutionId) {
            loadInstitution(institutionId);
        } else if (open && !institutionId) {
            resetForm();
        }
    }, [open, institutionId]);

    async function loadInstitution(id: number) {
        try {
            setLoading(true);
            const institution = await institutionService.getById(id);
            const institutionData = {
                name: institution.name,
                address: institution.address,
                city: institution.city,
                state: institution.state,
                zip_code: institution.zip_code,
                phone: institution.phone,
                email: institution.email,
                website: institution.website || '',
            };

            reset(institutionData);
        } catch (err) {
            console.error('Error loading institution:', err);
            toast.error('Erro ao carregar instituição', {
                description: 'Não foi possível carregar os dados da instituição. Tente novamente.',
            });
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        reset({
            name: '',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            phone: '',
            email: '',
            website: '',
        });
    }

    async function handleFormSubmit(data: CreateInstitutionFormData | EditInstitutionFormData) {
        try {
            setLoading(true);

            if (isEditing && institutionId) {
                const updateData: Partial<InstitutionFormData> = {};

                if (dirtyFields.name && data.name) updateData.name = data.name;
                if (dirtyFields.address && data.address) updateData.address = data.address;
                if (dirtyFields.city && data.city) updateData.city = data.city;
                if (dirtyFields.state && data.state) updateData.state = data.state;
                if (dirtyFields.zip_code && data.zip_code) updateData.zip_code = data.zip_code;
                if (dirtyFields.phone && data.phone) updateData.phone = data.phone;
                if (dirtyFields.email && data.email) updateData.email = data.email;
                if (dirtyFields.website && data.website) updateData.website = data.website;

                await institutionService.update(institutionId, updateData);
                toast.success('Instituição atualizada!', {
                    description: 'A instituição foi atualizada com sucesso.',
                });
            } else {
                await institutionService.create(data as InstitutionFormData);
                toast.success('Instituição criada!', {
                    description: 'A instituição foi criada com sucesso.',
                });
            }

            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error('Error saving institution:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível salvar a instituição. Tente novamente.';
            toast.error('Erro ao salvar instituição', {
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Instituição' : 'Nova Instituição'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Nome {!isEditing && '*'}
                            </label>
                            <Input
                                id="name"
                                placeholder="Nome da instituição"
                                {...register('name')}
                                error={errors.name?.message}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium mb-1">
                                Endereço {!isEditing && '*'}
                            </label>
                            <Input
                                id="address"
                                placeholder="Rua, número, complemento"
                                {...register('address')}
                                error={errors.address?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="city" className="block text-sm font-medium mb-1">
                                Cidade {!isEditing && '*'}
                            </label>
                            <Input
                                id="city"
                                placeholder="Cidade"
                                {...register('city')}
                                error={errors.city?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium mb-1">
                                Estado {!isEditing && '*'}
                            </label>
                            <Input
                                id="state"
                                placeholder="UF"
                                maxLength={2}
                                {...register('state')}
                                error={errors.state?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="zip_code" className="block text-sm font-medium mb-1">
                                CEP {!isEditing && '*'}
                            </label>
                            <Input
                                id="zip_code"
                                placeholder="00000-000"
                                {...register('zip_code')}
                                error={errors.zip_code?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                Telefone {!isEditing && '*'}
                            </label>
                            <Input
                                id="phone"
                                placeholder="(00) 00000-0000"
                                {...register('phone')}
                                error={errors.phone?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                E-mail {!isEditing && '*'}
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="contato@instituicao.edu.br"
                                {...register('email')}
                                error={errors.email?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="website" className="block text-sm font-medium mb-1">
                                Website
                            </label>
                            <Input
                                id="website"
                                placeholder="https://www.instituicao.edu.br"
                                {...register('website')}
                                error={errors.website?.message}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Instituição'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
