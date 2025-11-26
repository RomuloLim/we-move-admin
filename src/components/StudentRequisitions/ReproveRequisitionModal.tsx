import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/Button';
import { Textarea } from '@/components/Textarea';
import { reprovedFieldLabels, availableReprovedFields, type ReprovedField } from '@/enums/reprovedFields';

type ReproveRequisitionModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: { deny_reason: string; reproved_fields: string[] }) => void;
    loading?: boolean;
};

const reproveSchema = z.object({
    deny_reason: z.string()
        .min(1, 'Motivo da rejeição é obrigatório')
        .max(1000, 'Motivo da rejeição deve ter no máximo 1000 caracteres'),
    reproved_fields: z.array(z.string())
        .min(1, 'Selecione pelo menos um campo reprovado'),
});

type ReproveFormData = z.infer<typeof reproveSchema>;

export function ReproveRequisitionModal({
    open,
    onOpenChange,
    onConfirm,
    loading = false,
}: ReproveRequisitionModalProps) {
    const [selectedFields, setSelectedFields] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        clearErrors,
        formState: { errors },
    } = useForm<ReproveFormData>({
        resolver: zodResolver(reproveSchema),
        defaultValues: {
            deny_reason: '',
            reproved_fields: [],
        },
    });

    function handleFieldToggle(field: string) {
        setSelectedFields(prev => {
            const newFields = prev.includes(field)
                ? prev.filter(f => f !== field)
                : [...prev, field];

            // Atualiza o valor no formulário
            setValue('reproved_fields', newFields);

            // Limpa o erro se pelo menos um campo foi selecionado
            if (newFields.length > 0) {
                clearErrors('reproved_fields');
            }

            return newFields;
        });
    }

    function handleFormSubmit(data: ReproveFormData) {
        // Validação adicional
        if (selectedFields.length === 0) {
            return;
        }

        onConfirm({
            deny_reason: data.deny_reason,
            reproved_fields: selectedFields,
        });
    }

    function handleClose() {
        reset();
        setSelectedFields([]);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Reprovar Solicitação</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div>
                        <label htmlFor="deny_reason" className="block text-sm font-medium mb-1">
                            Motivo da Rejeição *
                        </label>
                        <Textarea
                            id="deny_reason"
                            placeholder="Descreva o motivo da rejeição..."
                            rows={4}
                            maxLength={1000}
                            {...register('deny_reason')}
                            error={errors.deny_reason?.message}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Máximo de 1000 caracteres
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Campos Reprovados *
                        </label>
                        {errors.reproved_fields && (
                            <p className="text-sm text-red-600 mb-2">
                                {errors.reproved_fields.message}
                            </p>
                        )}
                        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-md p-3">
                            {availableReprovedFields.map((field) => (
                                <label
                                    key={field}
                                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedFields.includes(field)}
                                        onChange={() => handleFieldToggle(field)}
                                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {reprovedFieldLabels[field as ReprovedField]}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {selectedFields.length} campo(s) selecionado(s)
                        </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={loading || selectedFields.length === 0}
                        >
                            {loading ? 'Reprovando...' : 'Reprovar Solicitação'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
