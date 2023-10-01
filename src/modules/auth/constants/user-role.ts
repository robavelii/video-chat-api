export enum UserRole {
    SUPER_ADMIN = 'SUPER_ADMIN',
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    STAFF_MEMBER = 'STAFF_MEMBER',
}

export const USER_ROLE_RANK: Record<UserRole, number> = {
    SUPER_ADMIN: 1000,
    ADMIN: 500,
    MANAGER: 100,
    STAFF_MEMBER: 50,
};
