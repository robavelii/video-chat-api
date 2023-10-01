import { UnprocessableEntityException } from '@nestjs/common';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { FilterDto } from './filter.dto';

const filterRegexp = /([A-Za-z.]+)(>=|<=|<|>|!=|=|~|\^)(.*)/;

export class GetPageDto {
    @ApiPropertyOptional({ minimum: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    page?: number;

    @ApiPropertyOptional({ minimum: 1, maximum: 2000 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    count?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    id?: number[];

    @ApiPropertyOptional({ enum: [] })
    @IsOptional()
    @IsEnum([])
    sortField?: string;

    @ApiPropertyOptional({ enum: ['ASC', 'DESC'] })
    @IsOptional()
    @IsEnum(['ASC', 'DESC'])
    sort?: 'ASC' | 'DESC';

    @ApiPropertyOptional({
        isArray: true,
    })
    @IsOptional()
    @Transform((params) => {
        const filtersStr: string[] = !Array.isArray(params.value)
            ? [params.value]
            : params.value;

        const filters = [];

        for (const value of filtersStr) {
            const parse = filterRegexp.exec(value);
            if (parse === null) {
                throw new UnprocessableEntityException({
                    value,
                    field: 'filter',
                    message: "Can't parse this filter",
                });
            }

            const filter = new FilterDto(parse[1], parse[2], parse[3]);
            filters.push(filter);
        }

        return filters;
    })
    filter?: FilterDto[];
}
