import { useEffect, useState } from 'react';
import { FileText, User, MapPin, Phone, GraduationCap, CheckCircle, Ban, AlertCircle } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/Button';
import { studentRequisitionService } from '@/services/studentRequisition.service';
import { RequisitionStatus, requisitionStatusLabels, requisitionStatusColors } from '@/enums/requisitionStatus';
import { atuationFormLabels } from '@/enums/atuationForm';
import { documentTypeLabels } from '@/enums/documentType';
import { reprovedFieldLabels } from '@/enums/reprovedFields';

type StudentRequisitionViewModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    requisitionId: number | null;
    onApprove?: (id: number, userId?: number) => void;
    onReject?: (id: number) => void;
};

export function StudentRequisitionViewModal({
    open,
    onOpenChange,
    requisitionId,
    onApprove,
    onReject,
}: StudentRequisitionViewModalProps) {
    const [requisition, setRequisition] = useState<StudentRequisition | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function loadRequisition() {
        if (!requisitionId) return;

        try {
            setLoading(true);
            setError(null);
            const data = await studentRequisitionService.getById(requisitionId);
            setRequisition(data);
        } catch (err) {
            setError('Erro ao carregar requisição. Tente novamente.');
            console.error('Error loading requisition:', err);
        } finally {
            setLoading(false);
        }
    }

    function handleOpenDocument(url: string) {
        window.open(url, '_blank');
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    function formatPhone(phone: string) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
        }
        return phone;
    }

    useEffect(() => {
        if (open && requisitionId) {
            loadRequisition();
        }
    }, [open, requisitionId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Detalhes da Requisição
                        {requisition && (
                            <span className="block text-sm font-normal text-gray-500 mt-1">
                                Protocolo: {requisition.protocol}
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-red-800">{error}</p>
                        </div>
                    )}

                    {requisition && !loading && !error && (
                        <div className="space-y-6">
                            {/* Status Badge */}
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${requisitionStatusColors[requisition.status as RequisitionStatus]}`}
                                >
                                    {requisitionStatusLabels[requisition.status as RequisitionStatus] || requisition.status}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Criado em: {formatDate(requisition.created_at)}
                                </span>
                            </div>

                            {/* Student Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <User className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Informações do Estudante
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Nome</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.student.user.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.student.user.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">CPF</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.student.user.cpf}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">RG</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.student.user.rg}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Data de Nascimento</p>
                                        <p className="font-medium text-gray-900">
                                            {formatDate(requisition.birth_date)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Cidade de Origem</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.student.city_of_origin}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <GraduationCap className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Informações Acadêmicas
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Instituição</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.institution_course.institution.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {requisition.institution_course.institution.acronym}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Curso</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.institution_course.course.name}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Semestre</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.semester}º Semestre
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Forma de Atuação</p>
                                        <p className="font-medium text-gray-900">
                                            {atuationFormLabels[requisition.atuation_form as keyof typeof atuationFormLabels] || requisition.atuation_form}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact and Address */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Contato e Endereço
                                    </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-600">Telefone</p>
                                        <p className="font-medium text-gray-900 flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {formatPhone(requisition.phone_contact)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Cidade</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.city}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-gray-600">Endereço</p>
                                        <p className="font-medium text-gray-900">
                                            {requisition.street_name}, {requisition.house_number}
                                            <br />
                                            {requisition.neighborhood}, {requisition.city}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            {requisition.documents && requisition.documents.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FileText className="w-5 h-5 text-gray-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Documentos
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {requisition.documents.map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => handleOpenDocument(doc.full_url)}
                                                className="flex items-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-white hover:border-indigo-500 transition-colors text-left"
                                            >
                                                <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {documentTypeLabels[doc.type as keyof typeof documentTypeLabels] || doc.type}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Clique para visualizar
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Deny Reason and Reproved Fields (if exists) */}
                            {(requisition.deny_reason && requisition.status === RequisitionStatus.REPROVED) && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-900 mb-2">
                                            Motivo da Rejeição
                                        </h3>
                                        <p className="text-red-800">{requisition.deny_reason}</p>
                                    </div>

                                    {requisition.reproved_fields && requisition.reproved_fields.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle className="w-5 h-5 text-red-700" />
                                                <h4 className="text-base font-semibold text-red-900">
                                                    Campos Reprovados
                                                </h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {requisition.reproved_fields.map((field, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800 border border-red-300"
                                                    >
                                                        {reprovedFieldLabels[field as keyof typeof reprovedFieldLabels] || field}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            {requisition.status === RequisitionStatus.PENDING && (
                                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            if (onReject && requisition) {
                                                onReject(requisition.id);
                                            }
                                        }}
                                    >
                                        <Ban className="w-4 h-4 mr-2" />
                                        Rejeitar Solicitação
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            if (onApprove && requisition) {
                                                onApprove(requisition.id, requisition.student.user.id);
                                            }
                                        }}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Aprovar Solicitação
                                    </Button>
                                </div>
                            )}
                            {requisition.status === RequisitionStatus.REPROVED && (
                                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            if (onApprove && requisition) {
                                                onApprove(requisition.id, requisition.student.user.id);
                                            }
                                        }}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Aprovar Solicitação
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

