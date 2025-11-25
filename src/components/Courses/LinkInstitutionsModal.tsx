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
import { cn } from '@/lib/utils';

type LinkInstitutionsModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courseId: number;
    onSuccess: () => void;
};

export function LinkInstitutionsModal({ open, onOpenChange, courseId, onSuccess }: LinkInstitutionsModalProps) {
    const [loading, setLoading] = useState(false);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [linkedInstitutionIds, setLinkedInstitutionIds] = useState<number[]>([]);
    const [initialLinkedInstitutionIds, setInitialLinkedInstitutionIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (open && courseId) {
            loadData();
        } else {
            setInstitutions([]);
            setLinkedInstitutionIds([]);
            setInitialLinkedInstitutionIds([]);
            setSearchTerm('');
        }
    }, [open, courseId]);

    async function loadData() {
        try {
            setLoading(true);
            // Fetch all institutions ordered by course (prioritizing linked ones)
            const response = await institutionService.getInstitutionsOrderedByCourse(courseId);

            setInstitutions(response.data);

            const linkedIds = response.data.filter(i => i.is_linked).map(i => i.id);
            setLinkedInstitutionIds(linkedIds);
            setInitialLinkedInstitutionIds(linkedIds);

        } catch (err) {
            console.error('Error loading institutions:', err);
            toast.error('Erro ao carregar instituições');
        } finally {
            setLoading(false);
        }
    }

    function toggleInstitution(institutionId: number) {
        setLinkedInstitutionIds(prev => {
            if (prev.includes(institutionId)) {
                return prev.filter(id => id !== institutionId);
            } else {
                return [...prev, institutionId];
            }
        });
    }

    async function handleSave() {
        try {
            setLoading(true);

            const toLink = linkedInstitutionIds.filter(id => !initialLinkedInstitutionIds.includes(id));
            const toUnlink = initialLinkedInstitutionIds.filter(id => !linkedInstitutionIds.includes(id));

            const promises = [];

            // For each institution to link, we must call the institution service
            for (const institutionId of toLink) {
                promises.push(institutionService.linkCourses(institutionId, { courses_ids: [courseId] } as any));
            }

            // For each institution to unlink
            for (const institutionId of toUnlink) {
                promises.push(institutionService.unlinkCourses(institutionId, [courseId]));
            }

            await Promise.all(promises);

            toast.success('Vínculos atualizados com sucesso!');
            onSuccess();
            onOpenChange(false);

        } catch (err: any) {
            console.error('Error saving institution links:', err);
            toast.error('Erro ao salvar vínculos');
        } finally {
            setLoading(false);
        }
    }

    const filteredInstitutions = institutions.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Vincular Instituições</DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4 flex-1 overflow-hidden flex flex-col">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar instituições..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto border rounded-md p-2 space-y-1">
                        {loading && institutions.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">Carregando...</div>
                        ) : filteredInstitutions.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground">Nenhuma instituição encontrada.</div>
                        ) : (
                            filteredInstitutions.map(inst => {
                                const isSelected = linkedInstitutionIds.includes(inst.id);
                                return (
                                    <div
                                        key={inst.id}
                                        className={cn(
                                            "flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors border",
                                            isSelected
                                                ? "bg-primary/5 border-primary/20"
                                                : "hover:bg-muted border-transparent"
                                        )}
                                        onClick={() => toggleInstitution(inst.id)}
                                    >
                                        <div>
                                            <div className="font-medium">{inst.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {inst.city}/{inst.state}
                                            </div>
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
                        {linkedInstitutionIds.length} instituição(ões) selecionada(s)
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
