/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/tslint/config */
import { SelectQueryBuilder } from 'typeorm';

import { VIRTUAL_COLUMN_KEY } from './decorators/virtual-column.decorator';

declare module 'typeorm' {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface SelectQueryBuilder<Entity> {
        getMany(
            this: SelectQueryBuilder<Entity>,
        ): Promise<Entity[] | undefined>;
        getOne(this: SelectQueryBuilder<Entity>): Promise<Entity | undefined>;
    }
}

SelectQueryBuilder.prototype.getMany = async function () {
    const { entities, raw } = await this.getRawAndEntities();

    const items = entities.map((entity, index) => {
        const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
        const item = raw[index];

        for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
            entity[propertyKey] = item[name];
        }

        return entity;
    });

    return [...items];
};

SelectQueryBuilder.prototype.getManyAndCount = async function () {
    const { entities, raw } = await this.getRawAndEntities();
    const count = await this.getCount();

    const items = entities.map((entity, index) => {
        const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entity) ?? {};
        const item = raw[index];

        for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
            entity[propertyKey] = item[name];
        }

        return entity;
    });

    return [[...items], count];
};

SelectQueryBuilder.prototype.getOne = async function () {
    const { entities, raw } = await this.getRawAndEntities();
    if (entities.length === 0) {
        return undefined;
    }

    const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, entities[0]) ?? {};

    for (const [propertyKey, name] of Object.entries<string>(metaInfo)) {
        entities[0][propertyKey] = raw[0][name];
    }

    return entities[0];
};
