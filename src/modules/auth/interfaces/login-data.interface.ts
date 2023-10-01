import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../dto/user/user.dto';
import IAuthTokensData from './auth-tokens-data.interface';

export default class ILoginData {
    @ApiProperty()
    user: UserDto;

    @ApiProperty()
    auth: IAuthTokensData;
}
