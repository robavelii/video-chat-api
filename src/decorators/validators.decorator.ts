/* tslint:disable:naming-convention */

import {
    registerDecorator,
    ValidateIf,
    ValidationOptions,
} from 'class-validator';

export function IsPassword(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object: any, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isPassword',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return /^(.){8,}$/.test(value);
                },
            },
        });
    };
}

export function IsDomain(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object: any, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'isDomain',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(
                        value,
                    );
                },
            },
        });
    };
}

export function IsStringKeyValue(
    validationOptions?: ValidationOptions,
): PropertyDecorator {
    return (object: any, propertyName: string) => {
        registerDecorator({
            propertyName,
            name: 'IsStringKeyValue',
            target: object.constructor,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: Record<string, string>) {
                    if (typeof value !== 'object') {
                        return false;
                    }

                    if (
                        [...Object.keys(value), ...Object.values(value)].filter(
                            (item) => typeof item !== 'string',
                        ).length > 0
                    ) {
                        return false;
                    }

                    return true;
                },
            },
        });
    };
}

export function IsNullable(validationOptions?: ValidationOptions) {
    return ValidateIf((_object, value) => value !== null, validationOptions);
}
