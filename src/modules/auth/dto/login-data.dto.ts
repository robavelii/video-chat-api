import { ApiProperty } from '@nestjs/swagger';

import { UserEntity } from '../entities/user.entity';
import { TokenDto } from './token.dto';
import { UserDto } from './user/user.dto';

export class LoginDataDto {
    @ApiProperty()
    user: UserDto;

    @ApiProperty()
    token: TokenDto;

    @ApiProperty()
    refreshToken: TokenDto;

    constructor(user: UserEntity, token: TokenDto, refreshToken: TokenDto) {
        this.user = user.toDto();
        this.token = token;
        this.refreshToken = refreshToken;
    }
}
