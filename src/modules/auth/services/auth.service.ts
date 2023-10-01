import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UtilsService } from '../../../providers/utils.service';
import { ConfigService } from '../../../shared/services/config.service';
import { LoginWithPasswordRequestDto } from '../dto/login-with-password-request.dto';
import { TokenDto } from '../dto/token.dto';
import { UserEntity } from '../entities/user.entity';
import IAuthTokensData from '../interfaces/auth-tokens-data.interface';
import { IJwtUser } from '../interfaces/jwt-user.interface';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    public async validateToken(token: string): Promise<boolean> {
        try {
            await this.jwtService.verifyAsync(token, {
                secret: this.configService.jwtTokenSecret,
            });
            return true;
        } catch (_err) {
            return false;
        }
    }

    public async createToken(user: UserEntity): Promise<IAuthTokensData> {
        const userData: IJwtUser = {
            id: user.id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        };

        const token = new TokenDto({
            expiresIn: this.configService.jwtTokenExpire,
            accessToken: await this.jwtService.signAsync(userData, {
                secret: this.configService.jwtTokenSecret,
                expiresIn: this.configService.jwtTokenExpire,
            }),
        });

        const refreshToken = new TokenDto({
            expiresIn: this.configService.jwtRefreshTokenExpire,
            accessToken: await this.jwtService.signAsync(userData, {
                secret: this.configService.jwtRefreshTokenSecret,
                expiresIn: this.configService.jwtRefreshTokenExpire,
            }),
        });

        await this.userService.updateRefreshToken(
            user,
            refreshToken.accessToken,
        );

        return {
            token,
            refreshToken,
        };
    }

    public async validateUser(
        dto: LoginWithPasswordRequestDto,
    ): Promise<UserEntity> {
        const user = await this.userService.findByEmail(dto.email);
        const isPasswordValid = await UtilsService.validateHash(
            dto.password,
            user && user.password,
        );

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
