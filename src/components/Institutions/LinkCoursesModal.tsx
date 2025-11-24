import { useState, useEffect } from 'react';
import { Search, Check } from 'lucide-react';
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
import { institutionService } from '@/services/institution.service';
import { courseService } from '@/services/course.service';
import { cn } from '@/lib/utils';

type LinkCoursesModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    institutionId: number;
    onSuccess: () => void;
};

export function LinkCoursesModal({ open, onOpenChange, institutionId, onSuccess }: LinkCoursesModalProps) {
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [linkedCourseIds, setLinkedCourseIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (open && institutionId) {
            loadData();
        } else {
            setCourses([]);
            setLinkedCourseIds([]);
            setSearchTerm('');
        }
    }, [open, institutionId]);

    async function loadData() {
        try {
            setLoading(true);
            // Fetch all courses ordered by institution (prioritizing linked ones)
            const response = await courseService.getCoursesOrderedByInstitution(institutionId);

            setCourses(response.data);

            const linkedIds = response.data.filter(c => c.is_linked).map(c => c.id);
            setLinkedCourseIds(linkedIds);

        } catch (err) {
            console.error('Error loading courses:', err);
            toast.error('Erro ao carregar cursos');
        } finally {
            setLoading(false);
        }
    }

    function toggleCourse(courseId: number) {
        setLinkedCourseIds(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        });
    }

    async function handleSave() {
        try {
            setLoading(true);

            // Calculate changes based on is_linked property
            const toLink = linkedCourseIds.filter(id => {
                const course = courses.find(c => c.id === id);
                return course && !course.is_linked;
            });

            const toUnlink = courses
                .filter(c => c.is_linked && !linkedCourseIds.includes(c.id))
                .map(c => c.id);

            const promises = [];

            if (toLink.length > 0) {
                promises.push(institutionService.linkCourses(institutionId, { courses_ids: toLink } as any));
            }

            if (toUnlink.length > 0) {
                promises.push(institutionService.unlinkCourses(institutionId, toUnlink));
            }

            await Promise.all(promises);

            toast.success('Vínculos atualizados com sucesso!');
            onSuccess();
            onOpenChange(false);

        } catch (err: any) {
            console.error('Error saving course links:', err);
            toast.error('Erro ao salvar vínculos');
        } finally {
            setLoading(false);
        }
    }

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Vincular Cursos</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar cursos..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-1">
                        {loading && courses.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
                        ) : filteredCourses.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">Nenhum curso encontrado.</div>
                        ) : (
                            filteredCourses.map(course => {
                                const isSelected = linkedCourseIds.includes(course.id);
                                return (
                                    <div
                                        key={course.id}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors border",
                                            isSelected
                                                ? "bg-primary/5 border-primary/20"
                                                : "hover:bg-muted border-transparent"
                                        )}
                                        onClick={() => toggleCourse(course.id)}
                                    >
                                        <div>
                                            <div className="font-medium">{course.name}</div>
                                            <div className="text-sm text-muted-foreground line-clamp-1">{course.description}</div>
                                        </div>
                                        {isSelected && (
                                            <Check className="w-5 h-5 text-primary" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="text-sm text-muted-foreground text-right">
                        {linkedCourseIds.length} curso(s) selecionado(s)
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
