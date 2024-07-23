export enum UserRole {
    // SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export const USER_ROLE_RANK: Record<UserRole, number> = {
    // SUPER_ADMIN: 1000,
    ADMIN: 500,
    USER: 100,
};
