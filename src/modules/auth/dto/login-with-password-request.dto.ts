import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginWithPasswordRequestDto {
    @ApiProperty()
    @IsString()
    @IsEmail()
    @Transform(({ value }) => String(value).toLowerCase())
    readonly email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    readonly password: string;
}
