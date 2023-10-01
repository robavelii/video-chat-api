import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { UserEntity } from '../modules/auth/entities/user.entity';
import { IJwtUser } from '../modules/auth/interfaces/jwt-user.interface';

@Injectable()
export class AuthUserJwtInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const jwt = <IJwtUser>request.user;
        if (jwt) {
            const user = new UserEntity();
            Object.assign(user, jwt);

            request.user = user;
        }

        return next.handle();
    }
}
