import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    expiresIn: number;

    constructor(data: { expiresIn: number; accessToken: string }) {
        this.expiresIn = data.expiresIn;
        this.accessToken = data.accessToken;
    }
}
