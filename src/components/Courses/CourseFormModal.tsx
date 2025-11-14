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
import { courseService } from '@/services/course.service';
import { CourseType, courseTypeLabels, availableCourseTypes } from '@/enums/courseType';
import { Textarea } from '../Textarea';

type CourseFormModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId?: number;
    onSuccess: () => void;
};

const courseSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(255, 'Nome deve ter no máximo 255 caracteres'),
    course_type: z.string().min(1, 'Tipo de curso é obrigatório'),
    description: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export function CourseFormModal({ open, onOpenChange, courseId, onSuccess }: CourseFormModalProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!courseId;

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            name: '',
            course_type: '',
            description: '',
        },
    });

    useEffect(() => {
        if (open && courseId) {
            loadCourse(courseId);
        } else if (open && !courseId) {
            resetForm();
        }
    }, [open, courseId]);

    async function loadCourse(id: number) {
        try {
            setLoading(true);
            const course = await courseService.getById(id);
            const courseData = {
                name: course.name,
                course_type: course.course_type,
                description: course.description || '',
            };

            reset(courseData);
        } catch (err) {
            console.error('Error loading course:', err);
            toast.error('Erro ao carregar curso', {
                description: 'Não foi possível carregar os dados do curso. Tente novamente.',
            });
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        reset({
            name: '',
            course_type: '',
            description: '',
        });
    }

    async function handleFormSubmit(data: CourseFormData) {
        try {
            setLoading(true);

            if (isEditing && courseId) {
                await courseService.update(courseId, data);
            } else {
                await courseService.create(data);
            }

            toast.success(`Curso ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);

            onSuccess();
            onOpenChange(false);
        } catch (err: any) {
            console.error('Error saving course:', err);
            const errorMessage = err.response?.data?.message || 'Não foi possível salvar o curso. Tente novamente.';
            toast.error('Erro ao salvar curso', {
                description: errorMessage,
            });
        } finally {
            setLoading(false);
        }
    }

    const courseTypeOptions = availableCourseTypes.map(type => ({
        value: type,
        label: courseTypeLabels[type],
    }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Curso' : 'Novo Curso'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Nome *
                            </label>
                            <Input
                                id="name"
                                placeholder="Nome do curso"
                                {...register('name')}
                                error={errors.name?.message}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="course_type" className="block text-sm font-medium mb-1">
                                Tipo de Curso *
                            </label>
                            <Controller
                                name="course_type"
                                control={control}
                                render={({ field }) => (
                                    <CustomSelect
                                        options={courseTypeOptions}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Selecione o tipo de curso"
                                        className="w-full"
                                    />
                                )}
                            />
                            {errors.course_type && (
                                <p className="text-sm text-red-600 mt-1">{errors.course_type.message}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium mb-1">
                                Descrição
                            </label>
                            <Textarea
                                id="description"
                                placeholder="Descrição do curso"
                                {...register('description')}
                                error={errors.description?.message}
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
                            {loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Curso'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
