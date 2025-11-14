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
import { CustomSelect, type SelectOption } from '@/components/Select';
import { userService } from '@/services/user.service';
import { UserType, userTypeLabels } from '@/enums/userType';

type UserFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId?: number;
    onSuccess: () => void;
};

const userTypeOptions: SelectOption[] = [
    { value: UserType.SUPER_ADMIN, label: userTypeLabels[UserType.SUPER_ADMIN] },
    { value: UserType.ADMIN, label: userTypeLabels[UserType.ADMIN] },
    { value: UserType.DRIVER, label: userTypeLabels[UserType.DRIVER] },
    { value: UserType.STUDENT, label: userTypeLabels[UserType.STUDENT] },
];

const createUserSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    cpf: z.string().min(11, 'CPF inválido'),
    rg: z.string().min(1, 'RG é obrigatório'),
    phone_contact: z.string().min(10, 'Telefone inválido'),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    user_type: z.nativeEnum(UserType),
});

const editUserSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
    email: z.string().email('E-mail inválido').optional(),
    cpf: z.string().min(11, 'CPF inválido').optional(),
    rg: z.string().min(1, 'RG é obrigatório').optional(),
    phone_contact: z.string().min(10, 'Telefone inválido').optional(),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').optional().or(z.literal('')),
    user_type: z.nativeEnum(UserType).optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type EditUserFormData = z.infer<typeof editUserSchema>;

export function UserFormModal({ open, onOpenChange, userId, onSuccess }: UserFormModalProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!userId;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, dirtyFields },
    } = useForm<CreateUserFormData | EditUserFormData>({
        resolver: zodResolver(isEditing ? editUserSchema : createUserSchema),
        defaultValues: {
            name: '',
            email: '',
            cpf: '',
            rg: '',
            phone_contact: '',
            password: '',
            user_type: UserType.DRIVER,
        },
    });

    const userTypeValue = watch('user_type');

    useEffect(() => {
        if (open && userId) {
            loadUser(userId);
        } else if (open && !userId) {
            resetForm();
        }
    }, [open, userId]);

    async function loadUser(id: number) {
        try {
            setLoading(true);
            const user = await userService.getById(id);
            const userData = {
                name: user.name,
                email: user.email,
                cpf: user.cpf,
                rg: user.rg,
                phone_contact: user.phone_contact,
                password: '',
                user_type: user.user_type as UserType,
            };

            reset(userData);
        } catch (err) {
            console.error('Error loading user:', err);
            toast.error('Erro ao carregar usuário', {
                description: 'Não foi possível carregar os dados do usuário. Tente novamente.',
            });
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        reset({
            name: '',
            email: '',
            cpf: '',
            rg: '',
            phone_contact: '',
            password: '',
            user_type: UserType.DRIVER,
        });
    }

    async function handleFormSubmit(data: CreateUserFormData | EditUserFormData) {
        try {
            setLoading(true);

            if (isEditing && userId) {
                const updateData: Partial<UserFormData> = {};

                if (dirtyFields.name && data.name) updateData.name = data.name;
                if (dirtyFields.email && data.email) updateData.email = data.email;
                if (dirtyFields.cpf && data.cpf) updateData.cpf = data.cpf;
                if (dirtyFields.rg && data.rg) updateData.rg = data.rg;
                if (dirtyFields.phone_contact && data.phone_contact) updateData.phone_contact = data.phone_contact;
                if (dirtyFields.password && data.password) updateData.password = data.password;
                if (dirtyFields.user_type && data.user_type) updateData.user_type = data.user_type;

                await userService.update(userId, updateData as UserFormData);
                toast.success('Usuário atualizado!', {
                    description: 'O usuário foi atualizado com sucesso.',
                });
            } else {
                await userService.create(data as UserFormData);
                toast.success('Usuário criado!', {
                    description: 'O usuário foi criado com sucesso.',
                });
            }

            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error('Error saving user:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível salvar o usuário. Tente novamente.';
            toast.error('Erro ao salvar usuário', {
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }

    function handleUserTypeChange(value: string) {
        setValue('user_type', value as UserType);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Nome {!isEditing && '*'}
                            </label>
                            <Input
                                id="name"
                                placeholder="Nome completo"
                                {...register('name')}
                                error={errors.name?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                E-mail {!isEditing && '*'}
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@example.com"
                                {...register('email')}
                                error={errors.email?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="cpf" className="block text-sm font-medium mb-1">
                                CPF {!isEditing && '*'}
                            </label>
                            <Input
                                id="cpf"
                                placeholder="000.000.000-00"
                                {...register('cpf')}
                                error={errors.cpf?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="rg" className="block text-sm font-medium mb-1">
                                RG {!isEditing && '*'}
                            </label>
                            <Input
                                id="rg"
                                placeholder="00.000.000-0"
                                {...register('rg')}
                                error={errors.rg?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="phone_contact" className="block text-sm font-medium mb-1">
                                Telefone {!isEditing && '*'}
                            </label>
                            <Input
                                id="phone_contact"
                                placeholder="(00) 00000-0000"
                                {...register('phone_contact')}
                                error={errors.phone_contact?.message}
                            />
                        </div>

                        <div>
                            <label htmlFor="user_type" className="block text-sm font-medium mb-1">
                                Tipo de Usuário {!isEditing && '*'}
                            </label>
                            <CustomSelect
                                options={userTypeOptions}
                                value={userTypeValue}
                                onChange={handleUserTypeChange}
                                placeholder="Selecione o tipo"
                            />
                            {errors.user_type && (
                                <p className="text-sm text-red-500 mt-1">{errors.user_type.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
                                Senha {!isEditing && '*'} {isEditing && '(deixe em branco para não alterar)'}
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder={isEditing ? "Deixe em branco para manter a senha atual" : "Mínimo 8 caracteres"}
                                {...register('password')}
                                error={errors.password?.message}
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
                            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Usuário'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
