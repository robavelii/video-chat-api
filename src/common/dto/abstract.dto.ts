import { ApiPropertyOptional } from '@nestjs/swagger';

import { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
    @ApiPropertyOptional({
        oneOf: [{ type: 'number' }, { type: 'string' }],
    })
    id: number | string;

    constructor(entity: AbstractEntity, exposeId = true) {
        if (exposeId) {
            this.id = entity.id;
        }
    }
}
