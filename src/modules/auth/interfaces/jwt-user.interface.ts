import { UserRole } from '../constants/user-role';

export interface IJwtUser {
    iat?: number;
    exp?: number;
    id: number;
    name: string;
    middleName: string;
    surname: string;
    email: string;
    role: UserRole;
}
