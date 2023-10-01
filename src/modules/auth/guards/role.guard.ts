import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../constants/user-role';
import { IJwtUser } from '../interfaces/jwt-user.interface';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<UserRole[]>(
            'roles',
            context.getHandler(),
        );

        const request = context.switchToHttp().getRequest();
        const jwt = <IJwtUser>request.user;
        return roles.includes(jwt.role);
    }
}
