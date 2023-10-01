import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from './abstract.dto';

export class PaginationDto<T extends AbstractDto> {
    @ApiProperty({ isArray: true, type: AbstractDto })
    results: T[];

    @ApiProperty()
    count: number;
}
