import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';

import { IsPassword } from '../../../../decorators/validators.decorator';
import { UserRole } from '../../constants/user-role';

export class UserCreateDto {
    @ApiProperty()
    @IsEmail()
    @Transform(({ value }) => String(value).toLowerCase())
    email: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    middleName: string;

    @ApiProperty()
    @IsString()
    surname: string;

    @ApiProperty()
    @IsPassword()
    password: string;

    @ApiProperty({ enum: UserRole })
    @IsEnum(UserRole)
    role: UserRole;
}
