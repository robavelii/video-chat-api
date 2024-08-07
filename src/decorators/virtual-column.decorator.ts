import 'reflect-metadata';

export const VIRTUAL_COLUMN_KEY = Symbol('VIRTUAL_COLUMN_KEY');

// tslint:disable-next-line:naming-convention
export function VirtualColumn(name?: string): PropertyDecorator {
    return (target: unknown, propertyKey: string) => {
        const metaInfo = Reflect.getMetadata(VIRTUAL_COLUMN_KEY, target) || {};

        metaInfo[propertyKey] = name ?? propertyKey;
        Reflect.defineMetadata(VIRTUAL_COLUMN_KEY, metaInfo, target);
    };
}
