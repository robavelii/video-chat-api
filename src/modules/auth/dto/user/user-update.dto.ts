import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { UserRole } from '../../constants/user-role';
import { UserUpdateCurrentDto } from './user-update-current';

export class UserUpdateDto extends UserUpdateCurrentDto {
    @ApiPropertyOptional({
        description: 'Can be changed only by admin with same / higher role',
    })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ enum: UserRole })
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
