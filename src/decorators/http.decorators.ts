/* eslint-disable @typescript-eslint/tslint/config */
import {
    applyDecorators,
    Param,
    ParseUUIDPipe,
    PipeTransform,
    SetMetadata,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import e from 'express';

import { AuthUserInterceptor } from '../interceptors/auth-user.interceptor';
import { AuthUserJwtInterceptor } from '../interceptors/auth-user-jwt.interceptor';
import { UserRole } from '../modules/auth/constants/user-role';
import { RefreshGuard } from '../modules/auth/guards/refresh.guard';
import { RoleGuard } from '../modules/auth/guards/role.guard';
import { UserGuard } from '../modules/auth/guards/user.guard';

function createDecorators(): MethodDecorator[] {
    return [
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ];
}

interface IAuthOptions {
    loadUser?: boolean;
    roles?: UserRole[];
    refreshTokenOnly?: boolean;
    throwUnauthorized?: boolean;
}

export function Auth(options?: IAuthOptions) {
    const decorators = createDecorators();

    decorators.push(
        SetMetadata('authRequired', options?.throwUnauthorized !== false),
    );

    if (options?.refreshTokenOnly) {
        decorators.push(UseGuards(RefreshGuard));
    } else {
        decorators.push(UseGuards(UserGuard));
    }

    if (options?.roles) {
        decorators.push(
            ApiOperation({
                summary:
                    options.roles.length === 2 &&
                    options.roles.includes(UserRole.ADMIN) 
                    // &&
                    // options.roles.includes(UserRole.SUPER_ADMIN)
                        ? '(only admin)'
                        : '',
                description: 'Roles accepted: ' + options.roles.join(', '),
            }),
        );
        decorators.push(SetMetadata('roles', options.roles));
        decorators.push(UseGuards(RoleGuard));
    }

    decorators.push(UseInterceptors(AuthUserJwtInterceptor));
    if (options?.loadUser === true) {
        decorators.push(UseInterceptors(AuthUserInterceptor));
    }

    return applyDecorators(...decorators);
}

export function AuthRefresh(options?: IAuthOptions) {
    return Auth({ ...options, refreshTokenOnly: true });
}

export function UUIDParam(
    property: string,
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
    return Param(property, new ParseUUIDPipe({ version: '4' }), ...pipes);
}
