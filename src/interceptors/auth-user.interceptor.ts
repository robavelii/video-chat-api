import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { IJwtUser } from '../modules/auth/interfaces/jwt-user.interface';
import { UserService } from '../modules/auth/services/user.service';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
    constructor(private readonly userService: UserService) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const jwt = <IJwtUser>request.user;
        if (jwt) {
            const user = await this.userService.findById(jwt.id);
            if (!user) {
                throw new UnauthorizedException();
            }
            if (user.isActive) {
                throw new UnauthorizedException('User is suspended');
            }

            request.user = user;
        }

        return next.handle();
    }
}
