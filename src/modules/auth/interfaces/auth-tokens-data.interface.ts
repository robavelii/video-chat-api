import { ApiProperty } from '@nestjs/swagger';

import ITokenData from './token-data.interface';

export default class IAuthTokensData {
    @ApiProperty()
    token: ITokenData;

    @ApiProperty()
    refreshToken: ITokenData;
}
