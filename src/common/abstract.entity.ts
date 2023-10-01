/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { UtilsService } from '../providers/utils.service';
import { AbstractDto } from './dto/abstract.dto';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
    id: string | number;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp with time zone',
        name: 'updated_at',
    })
    updatedAt: Date;

    abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

    toDto(options?: unknown): T {
        return UtilsService.toDto(this.dtoClass, this, options);
    }
}
