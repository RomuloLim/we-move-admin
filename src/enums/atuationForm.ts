export enum AtuationForm {
    STUDENT = 'student',
    BOLSIST = 'bolsist',
    TEACHER = 'teacher',
    PREP_COURSE = 'prep_course',
    OTHER = 'other',
}

export const atuationFormLabels: Record<AtuationForm, string> = {
    [AtuationForm.STUDENT]: 'Estudante',
    [AtuationForm.BOLSIST]: 'Bolsista',
    [AtuationForm.TEACHER]: 'Professor',
    [AtuationForm.PREP_COURSE]: 'Curso Preparatório',
    [AtuationForm.OTHER]: 'Outro',
};

export const availableAtuationForms: AtuationForm[] = [
    AtuationForm.STUDENT,
    AtuationForm.BOLSIST,
    AtuationForm.TEACHER,
    AtuationForm.PREP_COURSE,
    AtuationForm.OTHER,
];
