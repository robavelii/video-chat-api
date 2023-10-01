import { SelectQueryBuilder } from 'typeorm';

import { GetPageDto } from './dto/get-page.dto';

export class AbstractEntityService {
    createQueryBuilderDto<T>(
        qb: SelectQueryBuilder<T>,
        dto: GetPageDto,
    ): SelectQueryBuilder<T> {
        if (dto.sortField && dto.sort) {
            qb.orderBy(dto.sortField, dto.sort);
        }
        if (dto.filter) {
            for (let i = 0; i < dto.filter.length; i++) {
                const filter = dto.filter[i];
                const isArray = filter.operator === 'IN';
                const isILike = filter.operator === 'ILIKE';

                qb.andWhere(
                    `${filter.field} ${filter.operator} ${isArray ? '(' : ''}:${
                        isArray ? '...' : ''
                    }filter_${i}${isArray ? ')' : ''}`,
                    {
                        [`filter_${i}`]: isArray
                            ? filter.value
                            : `${isILike ? '%' : ''}${filter.value as string}${
                                  isILike ? '%' : ''
                              }`,
                    },
                );
            }
        }
        if (dto.page !== undefined && dto.count !== undefined) {
            qb.skip(dto.page * dto.count);
            qb.take(dto.count);
        }

        if (dto.id) {
            if (!Array.isArray(dto.id)) {
                dto.id = [dto.id];
            }

            qb.andWhere(`${qb.alias}.id IN (:...ids)`, { ids: dto.id });
        }

        return qb;
    }
}
