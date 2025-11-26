export enum DocumentType {
    RESIDENCY_PROOF = 'residency_proof',
    IDENTIFICATION_DOCUMENT = 'identification_document',
    PROFILE_PICTURE = 'profile_picture',
    ENROLLMENT_PROOF = 'enrollment_proof',
}

export const documentTypeLabels: Record<DocumentType, string> = {
    [DocumentType.RESIDENCY_PROOF]: 'Comprovante de Residência',
    [DocumentType.IDENTIFICATION_DOCUMENT]: 'Documento de Identificação',
    [DocumentType.PROFILE_PICTURE]: 'Foto de Perfil',
    [DocumentType.ENROLLMENT_PROOF]: 'Comprovante de Matrícula',
};

export const availableDocumentTypes: DocumentType[] = [
    DocumentType.RESIDENCY_PROOF,
    DocumentType.IDENTIFICATION_DOCUMENT,
    DocumentType.PROFILE_PICTURE,
    DocumentType.ENROLLMENT_PROOF,
];
