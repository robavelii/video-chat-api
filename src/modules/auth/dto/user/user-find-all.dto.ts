import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { FilterDto } from '../../../../common/dto/filter.dto';
import { GetPageDto } from '../../../../common/dto/get-page.dto';
import { AllowedFilters } from '../../../../decorators/allowed-filters.decorator';
import { UserRole } from '../../constants/user-role';

const sortFields = [
    'user.id',
    'user.email',
    'user.createdAt',
    'user.lastLogin',
    'user.isActive',
    'user.role',
];

export class UserFindAllDto extends GetPageDto {
    @ApiPropertyOptional({ enum: sortFields })
    @IsOptional()
    @IsEnum(sortFields)
    sortField: string;

    @AllowedFilters({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user.id': { type: 'int' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user.email': { type: 'string' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user.createdAt': { type: 'date' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user.lastLogin': { type: 'date' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user.isActive': { type: 'boolean' },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'user.role': { type: 'enum', enum: UserRole },
    })
    filter: FilterDto[];
}
