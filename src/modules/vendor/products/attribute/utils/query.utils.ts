// src/modules/vendor/products/attribute/utils/query.utils.ts
import { Op, WhereOptions } from 'sequelize';
import { ListAttributeDto } from '../dto/list-attribute.dto';

export function buildFilters(dto: ListAttributeDto): WhereOptions {
    const where: any = {};

    if (dto.search) {
        where[Op.or as any] = [
            { name: { [Op.iLike]: `%${dto.search}%` } },
            { code: { [Op.iLike]: `%${dto.search}%` } },
        ];
    }

    if (dto.is_filterable !== undefined) where.is_filterable = dto.is_filterable;
    if (dto.is_visible !== undefined) where.is_visible = dto.is_visible;
    if (dto.is_variant_attribute !== undefined) {
        where.is_variant_attribute = dto.is_variant_attribute;
    }
    if (dto.is_required !== undefined) where.is_required = dto.is_required;

    return where;
}
