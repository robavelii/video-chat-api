/* tslint:disable:naming-convention */

import { applyDecorators } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { registerDecorator } from 'class-validator';

import { FilterDto, FilterOperator } from '../common/dto/filter.dto';

type Type = 'date' | 'int' | 'float' | 'string' | 'boolean' | 'enum';

type AllowedFiltersOptions = Record<
    string,
    {
        type: Type;
        enum?: Record<string, string>;
    }
>;

const operators: Record<Type, FilterOperator[]> = {
    string: ['!=', '=', 'ILIKE', 'IN'],
    int: ['!=', '=', '<', '<=', '>=', '>', 'IN'],
    float: ['!=', '=', '<', '<=', '>=', '>', 'IN'],
    date: ['!=', '=', '<', '<=', '>=', '>', 'IN'],
    enum: ['!=', '=', 'IN'],
    boolean: ['='],
};

function AllowedFiltersValidator(
    options: AllowedFiltersOptions,
): PropertyDecorator {
    return function (object: any, propertyName: string): void {
        registerDecorator({
            propertyName,
            name: 'allowedFilters',
            target: object.constructor,
            validator: {
                validate(filters: FilterDto[]) {
                    for (const filter of filters) {
                        if (
                            options[filter.field] === undefined ||
                            !operators[options[filter.field].type].includes(
                                filter.operator,
                            )
                        ) {
                            return false;
                        }

                        const tmpValueArray = Array.isArray(filter.value)
                            ? filter.value
                            : [filter.value];

                        for (const tmpValue of tmpValueArray) {
                            switch (options[filter.field].type) {
                                case 'date':
                                    try {
                                        const date = new Date(tmpValue);
                                        if (
                                            !(date instanceof Date) ||
                                            isNaN(Number(date))
                                        ) {
                                            return false;
                                        }
                                    } catch (error) {
                                        return false;
                                    }
                                    break;
                                case 'int':
                                    if (
                                        parseInt(tmpValue, 10).toString() !==
                                        tmpValue
                                    ) {
                                        return false;
                                    }
                                    break;
                                case 'float':
                                    if (
                                        parseFloat(tmpValue).toString() !==
                                        tmpValue
                                    ) {
                                        return false;
                                    }
                                    break;
                                case 'boolean':
                                    if (
                                        !['true', 'false'].includes(
                                            tmpValue.toLowerCase(),
                                        )
                                    ) {
                                        return false;
                                    }
                                    break;
                                case 'enum':
                                    if (
                                        !options[filter.field].enum ||
                                        !options[filter.field].enum[tmpValue]
                                    ) {
                                        return false;
                                    }
                            }
                        }
                    }

                    return true;
                },
            },
        });
    };
}

export function AllowedFilters(
    options: AllowedFiltersOptions,
): PropertyDecorator {
    const strOptions = [];
    for (const key of Object.keys(options)) {
        strOptions.push(
            `${key} ${operators[options[key].type]
                .map((o) => (o === 'ILIKE' ? '~' : o === 'IN' ? '^' : o))
                .join(', ')}`,
        );
    }

    return applyDecorators(
        AllowedFiltersValidator(options),
        ApiPropertyOptional({
            description: `<i>Available values : </i><br/><small>(~ is like, ^ is in, comma is array delimiter)</small><br/>${strOptions.join(
                '<br/>',
            )}`,
        }),
    );
}
