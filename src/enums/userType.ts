export enum UserType {
    SUPER_ADMIN = 'super-admin',
    ADMIN = 'admin',
    DRIVER = 'driver',
    STUDENT = 'student',
}

export const userTypeLabels: Record<UserType, string> = {
    [UserType.SUPER_ADMIN]: 'Super Admin',
    [UserType.ADMIN]: 'Admin',
    [UserType.DRIVER]: 'Motorista',
    [UserType.STUDENT]: 'Estudante',
};

export const availableUserTypes: UserType[] = [
    UserType.ADMIN,
    UserType.DRIVER,
    UserType.STUDENT,
];