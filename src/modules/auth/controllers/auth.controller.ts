import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SuccessDto } from '../../../common/dto/success.dto';
import { CurrentUser } from '../../../decorators/current-user.decorator';
import { Auth, AuthRefresh } from '../../../decorators/http.decorators';
import { LoginWithPasswordRequestDto } from '../dto/login-with-password-request.dto';
import { UserEntity } from '../entities/user.entity';
import ILoginData from '../interfaces/login-data.interface';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    private async loginUser(user: UserEntity): Promise<ILoginData> {
        if (user.isSuspended) {
            throw new UnauthorizedException('User is not active');
        }

        await this.userService.refreshLastLogin(user);

        return {
            user: user.toDto(),
            auth: await this.authService.createToken(user),
        };
    }

    @Post('login')
    @ApiOperation({ summary: 'Login to system' })
    async login(@Body() dto: LoginWithPasswordRequestDto): Promise<ILoginData> {
        const user = await this.authService.validateUser(dto);
        return this.loginUser(user);
    }

    @Post('refresh')
    @AuthRefresh({ loadUser: true })
    @ApiOperation({ summary: 'Method to refresh key' })
    async refresh(@CurrentUser() user: UserEntity): Promise<ILoginData> {
        return this.loginUser(user);
    }

    @Post('logout')
    @Auth({ loadUser: true })
    @ApiResponse({ type: SuccessDto })
    @ApiOperation({ summary: 'Logout from system' })
    @ApiResponse({ status: 200, description: 'sucess: true' })
    async logout(@CurrentUser() user: UserEntity): Promise<SuccessDto> {
        await this.userService.updateRefreshToken(user, null);
        return new SuccessDto(true);
    }
}
