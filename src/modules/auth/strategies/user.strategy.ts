import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IManagerJwtData } from '../../../interfaces/manager-jwt-data.interface';
import { ConfigService } from '../../../shared/services/config.service';

@Injectable()
export class UserStrategy extends PassportStrategy(Strategy, 'user') {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (socket: any) => socket?.handshake?.auth?.token,
                (request) => {
                    const bearer = request?.headers?.authorization;
                    if (bearer && typeof bearer === 'string') {
                        return String(bearer).substring(7);
                    }
                    return false;
                },
            ]),
            secretOrKey: configService.jwtTokenSecret,
        });
    }

    validate(jwt: IManagerJwtData): IManagerJwtData {
        if (Date.now() > jwt.exp * 1000) {
            throw new UnauthorizedException();
        }

        return jwt;
    }
}
