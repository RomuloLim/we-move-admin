import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

import { vehicleService } from '@/services/vehicle.service';
import type { VehicleFormData, Vehicle } from '@/@types';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type VehicleFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    vehicleId?: number;
    onSuccess?: () => void;
};

export function VehicleFormModal({ open, onOpenChange, vehicleId, onSuccess }: VehicleFormModalProps) {
    const isEditMode = Boolean(vehicleId);

    const [loading, setLoading] = useState(false);
    const [loadingVehicle, setLoadingVehicle] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<VehicleFormData>({
        license_plate: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        capacity: 4,
        status: 'available',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof VehicleFormData, string>>>({});

    useEffect(() => {
        if (open && isEditMode && vehicleId) {
            loadVehicle(vehicleId);
        } else if (open && !isEditMode) {
            // Reset form when opening for new vehicle
            resetForm();
        }
    }, [open, isEditMode, vehicleId]);

    function resetForm() {
        setFormData({
            license_plate: '',
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            color: '',
            capacity: 4,
            status: 'available',
        });
        setErrors({});
        setError(null);
    }

    async function loadVehicle(id: number) {
        try {
            setLoadingVehicle(true);
            const response = await vehicleService.getById(id);
            const vehicle = response.data;

            setFormData({
                license_plate: vehicle.license_plate,
                brand: vehicle.brand,
                model: vehicle.model,
                year: vehicle.year,
                color: vehicle.color,
                capacity: vehicle.capacity,
                status: vehicle.status,
            });
        } catch (err) {
            setError('Erro ao carregar veículo. Tente novamente.');
            console.error('Error loading vehicle:', err);
        } finally {
            setLoadingVehicle(false);
        }
    }

    function validateForm(): boolean {
        const newErrors: Partial<Record<keyof VehicleFormData, string>> = {};

        if (!formData.license_plate.trim()) {
            newErrors.license_plate = 'Placa é obrigatória';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Modelo é obrigatório';
        }

        if (!formData.capacity || formData.capacity < 1 || formData.capacity > 100) {
            newErrors.capacity = 'Capacidade deve estar entre 1 e 100';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            if (isEditMode && vehicleId) {
                await vehicleService.update(vehicleId, formData);
            } else {
                await vehicleService.create(formData);
            }

            onOpenChange(false);
            onSuccess?.();
            resetForm();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                const serverErrors: Partial<Record<keyof VehicleFormData, string>> = {};
                Object.keys(err.response.data.errors).forEach((key) => {
                    serverErrors[key as keyof VehicleFormData] = err.response.data.errors[key][0];
                });
                setErrors(serverErrors);
            } else {
                setError(
                    err.response?.data?.message ||
                    `Erro ao ${isEditMode ? 'atualizar' : 'criar'} veículo. Tente novamente.`
                );
            }
            console.error('Error submitting form:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(field: keyof VehicleFormData, value: string | number) {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    }

    function handleOpenChange(newOpen: boolean) {
        if (!loading) {
            onOpenChange(newOpen);
            if (!newOpen) {
                resetForm();
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Editar Veículo' : 'Novo Veículo'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? 'Atualize as informações do veículo'
                            : 'Adicione um novo veículo à frota'}
                    </DialogDescription>
                </DialogHeader>

                {loadingVehicle ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-gray-500">Carregando...</div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-error-50 border border-error-200 text-error-800 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        {/* License Plate */}
                        <Input
                            id="license_plate"
                            label="Placa"
                            value={formData.license_plate}
                            onChange={(e) => handleChange('license_plate', e.target.value.toUpperCase())}
                            placeholder="ABC-1234"
                            error={errors.license_plate}
                        />

                        {/* Brand and Model */}
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                id="model"
                                label="Marca/Modelo"
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                placeholder="Corolla"
                                error={errors.model}
                            />
                        </div>

                        {/* Year and Color */}
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                id="capacity"
                                type="number"
                                label="Capacidade (número de passageiros)"
                                value={formData.capacity}
                                onChange={(e) => handleChange('capacity', Number(e.target.value))}
                                placeholder="4"
                                min="1"
                                max="100"
                                error={errors.capacity}
                            />
                        </div>

                        {/* Actions */}
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => handleOpenChange(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading} className="flex items-center gap-2">
                                <Save className="w-4 h-4" />
                                {loading
                                    ? 'Salvando...'
                                    : isEditMode
                                        ? 'Atualizar'
                                        : 'Criar'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
