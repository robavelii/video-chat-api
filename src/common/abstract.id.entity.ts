import { PrimaryGeneratedColumn } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { AbstractDto } from './dto/abstract.dto';

export abstract class AbstractIdEntity<
    T extends AbstractDto = AbstractDto,
> extends AbstractEntity<T> {
    @PrimaryGeneratedColumn()
    id: number;
}
