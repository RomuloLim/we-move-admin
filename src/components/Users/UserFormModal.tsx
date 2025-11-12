import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
import type { UserFormData, UserType } from '@/@types';

type UserFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userId?: number;
    onSuccess: () => void;
};

const userTypeOptions: SelectOption[] = [
    { value: 'super-admin', label: 'Super Administrador' },
    { value: 'admin', label: 'Administrador' },
    { value: 'driver', label: 'Motorista' },
    { value: 'passenger', label: 'Passageiro' },
];

export function UserFormModal({ open, onOpenChange, userId, onSuccess }: UserFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: '',
        cpf: '',
        rg: '',
        phone_contact: '',
        profile_picture_url: '',
        password: '',
        user_type: 'passenger' as UserType,
    });

    const isEditing = !!userId;

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
            setFormData({
                name: user.name,
                email: user.email,
                cpf: '',
                rg: '',
                phone_contact: '',
                profile_picture_url: '',
                password: '',
                user_type: user.user_type,
            });
        } catch (err) {
            console.error('Error loading user:', err);
            alert('Erro ao carregar usuário. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setFormData({
            name: '',
            email: '',
            cpf: '',
            rg: '',
            phone_contact: '',
            profile_picture_url: '',
            password: '',
            user_type: 'passenger',
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.cpf || !formData.password) {
            alert('Preencha todos os campos obrigatórios.');
            return;
        }

        try {
            setLoading(true);

            if (isEditing) {
                alert('Funcionalidade de edição ainda não foi implementada no backend.');
            } else {
                await userService.create(formData);
                onSuccess();
                onOpenChange(false);
            }
        } catch (err: any) {
            console.error('Error saving user:', err);
            const errorMessage = err.response?.data?.message || 'Erro ao salvar usuário. Tente novamente.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof UserFormData, value: string) {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Nome *
                            </label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Nome completo"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                E-mail *
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="cpf" className="block text-sm font-medium mb-1">
                                CPF *
                            </label>
                            <Input
                                id="cpf"
                                value={formData.cpf}
                                onChange={(e) => handleChange('cpf', e.target.value)}
                                placeholder="000.000.000-00"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="rg" className="block text-sm font-medium mb-1">
                                RG *
                            </label>
                            <Input
                                id="rg"
                                value={formData.rg}
                                onChange={(e) => handleChange('rg', e.target.value)}
                                placeholder="00.000.000-0"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone_contact" className="block text-sm font-medium mb-1">
                                Telefone *
                            </label>
                            <Input
                                id="phone_contact"
                                value={formData.phone_contact}
                                onChange={(e) => handleChange('phone_contact', e.target.value)}
                                placeholder="(00) 00000-0000"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="user_type" className="block text-sm font-medium mb-1">
                                Tipo de Usuário *
                            </label>
                            <CustomSelect
                                options={userTypeOptions}
                                value={formData.user_type}
                                onChange={(value) => handleChange('user_type', value as UserType)}
                                placeholder="Selecione o tipo"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="profile_picture_url" className="block text-sm font-medium mb-1">
                                URL da Foto de Perfil
                            </label>
                            <Input
                                id="profile_picture_url"
                                value={formData.profile_picture_url}
                                onChange={(e) => handleChange('profile_picture_url', e.target.value)}
                                placeholder="https://exemplo.com/foto.jpg"
                            />
                        </div>

                        {!isEditing && (
                            <div className="md:col-span-2">
                                <label htmlFor="password" className="block text-sm font-medium mb-1">
                                    Senha *
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    required
                                    minLength={8}
                                />
                            </div>
                        )}
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
