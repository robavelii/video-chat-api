import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { IsPassword } from '../../../../decorators/validators.decorator';

export class UserUpdateCurrentDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsPassword()
    password?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    middleName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    surname?: string;
}
