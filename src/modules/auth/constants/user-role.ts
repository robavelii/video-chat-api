export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
}

export const USER_ROLE_RANK: Record<UserRole, number> = {
    SUPER_ADMIN: 1000,
    ADMIN: 500,
    MANAGER: 100,
};
