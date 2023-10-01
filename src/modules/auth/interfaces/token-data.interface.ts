import { ApiProperty } from '@nestjs/swagger';

export default class ITokenData {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    expiresIn: number;
}
