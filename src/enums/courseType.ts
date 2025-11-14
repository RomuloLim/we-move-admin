export enum CourseType {
    GRADUATE = 'graduate',
    POST_GRADUATE = 'postgraduate',
    TECNOLOGO = 'extension',
    TECHNICAL = 'technical',
    OTHER = 'other',
}

export const courseTypeLabels: Record<CourseType, string> = {
    [CourseType.GRADUATE]: 'Graduação',
    [CourseType.POST_GRADUATE]: 'Pós-Graduação',
    [CourseType.TECNOLOGO]: 'Tecnólogo',
    [CourseType.TECHNICAL]: 'Técnico',
    [CourseType.OTHER]: 'Outro',
};

export const availableCourseTypes: CourseType[] = [
    CourseType.GRADUATE,
    CourseType.POST_GRADUATE,
    CourseType.TECNOLOGO,
    CourseType.TECHNICAL,
    CourseType.OTHER,
];
