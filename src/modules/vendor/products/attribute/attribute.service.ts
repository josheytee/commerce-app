// src/modules/attribute/attribute.service.ts
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import {
  AttributeModel,
  AttributeValueModel,
  AttributeTypeEnum,
} from 'src/infrastructure/database/models';

import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { QueryAttributeDto } from './dto/query-attribute.dto';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class AttributeService {
  private readonly logger = new Logger(AttributeService.name);

  constructor(private readonly sequelize: Sequelize) { }

  // ============================================================
  // ATTRIBUTES
  // ============================================================

  async create(dto: CreateAttributeDto): Promise<AttributeModel> {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);
    if (!slug) {
      throw new BadRequestException('Attribute name cannot be slugified');
    }

    // Reject color type without color codes on values
    if (dto.type === AttributeTypeEnum.COLOR) {
      const missing = (dto.values ?? []).filter((v) => !v.color_code);
      if (missing.length) {
        throw new BadRequestException(
          `Color attribute requires color_code on all values. Missing: ${missing
            .map((v) => v.value)
            .join(', ')}`,
        );
      }
    }

    return this.sequelize.transaction(async (t) => {
      const existing = await AttributeModel.findOne({
        where: { [Op.or]: [{ name: dto.name }, { slug }] },
        transaction: t,
      });
      if (existing) {
        throw new ConflictException(
          `Attribute with name "${dto.name}" or slug "${slug}" already exists`,
        );
      }

      const attribute = await AttributeModel.create(
        {
          name: dto.name,
          slug,
          type: dto.type,
          description: dto.description ?? null,
          sort_order: dto.sort_order ?? 0,
          is_active: dto.is_active ?? true,
        },
        { transaction: t },
      );

      if (dto.values?.length) {
        await this.createValuesForAttribute(attribute.id, dto.values, t);
      }

      return AttributeModel.findByPk(attribute.id, {
        include: [{ model: AttributeValueModel, as: 'values' }],
        transaction: t,
      }) as unknown as AttributeModel;
    });
  }

  async findAll(query: QueryAttributeDto): Promise<{
    rows: AttributeModel[];
    count: number;
  }> {
    const where: any = {};

    if (query.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${query.search}%` } },
        { slug: { [Op.iLike]: `%${query.search}%` } },
      ];
    }
    if (typeof query.is_active === 'boolean') {
      where.is_active = query.is_active;
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 50;

    return AttributeModel.findAndCountAll({
      where,
      include: [
        {
          model: AttributeValueModel,
          as: 'values',
          where: { is_active: true },
          required: false,
        },
      ],
      order: [
        ['sort_order', 'ASC'],
        ['name', 'ASC'],
        [{ model: AttributeValueModel, as: 'values' }, 'sort_order', 'ASC'],
      ],
      distinct: true,
      limit,
      offset: (page - 1) * limit,
    });
  }

  async findOne(id: number): Promise<AttributeModel> {
    const attribute = await AttributeModel.findByPk(id, {
      include: [{ model: AttributeValueModel, as: 'values' }],
    });
    if (!attribute) throw new NotFoundException(`Attribute ${id} not found`);
    return attribute;
  }

  async findBySlug(slug: string): Promise<AttributeModel> {
    const attribute = await AttributeModel.findOne({
      where: { slug },
      include: [{ model: AttributeValueModel, as: 'values' }],
    });
    if (!attribute) throw new NotFoundException(`Attribute "${slug}" not found`);
    return attribute;
  }

  async update(
    id: number,
    dto: UpdateAttributeDto,
  ): Promise<AttributeModel> {
    return this.sequelize.transaction(async (t) => {
      const attribute = await AttributeModel.findByPk(id, { transaction: t });
      if (!attribute) throw new NotFoundException(`Attribute ${id} not found`);

      const patch: any = { ...dto };
      if (dto.name && !dto.slug) {
        patch.slug = slugify(dto.name);
      } else if (dto.slug) {
        patch.slug = slugify(dto.slug);
      }
      delete patch.values; // handled separately

      await attribute.update(patch, { transaction: t });

      if (dto.values?.length) {
        // Add-only in update. To replace, use the dedicated value endpoints.
        const existing = await AttributeValueModel.findAll({
          where: { attribute_id: id },
          transaction: t,
        });
        const existingValues = new Set(existing.map((v) => v.value));
        const toCreate = dto.values.filter(
          (v) => !existingValues.has(v.value),
        );
        if (toCreate.length) {
          await this.createValuesForAttribute(id, toCreate, t);
        }
      }

      return AttributeModel.findByPk(id, {
        include: [{ model: AttributeValueModel, as: 'values' }],
        transaction: t,
      }) as unknown as AttributeModel;
    });
  }

  async remove(id: number): Promise<void> {
    const attribute = await AttributeModel.findByPk(id);
    if (!attribute) throw new NotFoundException(`Attribute ${id} not found`);

    // Check if in use by any variant
    const inUse = await this.isAttributeInUse(id);
    if (inUse) {
      throw new ConflictException(
        `Cannot delete attribute ${id}: it is assigned to one or more product variants`,
      );
    }

    await attribute.destroy(); // CASCADE deletes attribute_values
    this.logger.log(`Attribute ${id} deleted`);
  }

  async isAttributeInUse(id: number): Promise<boolean> {
    const count = await this.sequelize.query(
      `SELECT COUNT(*)::int AS n FROM product_variant_attribute_values WHERE attribute_id = :id`,
      { replacements: { id }, type: 'SELECT' as any },
    );
    return Number((count as any)[0]?.n ?? 0) > 0;
  }

  // ============================================================
  // ATTRIBUTE VALUES
  // ============================================================

  async listValues(attributeId: number): Promise<AttributeValueModel[]> {
    await this.findOne(attributeId); // ensures attribute exists
    return AttributeValueModel.findAll({
      where: { attribute_id: attributeId },
      order: [
        ['sort_order', 'ASC'],
        ['display_value', 'ASC'],
      ],
    });
  }

  async createValue(
    attributeId: number,
    dto: CreateAttributeValueDto,
  ): Promise<AttributeValueModel> {
    const attribute = await AttributeModel.findByPk(attributeId);
    if (!attribute) throw new NotFoundException(`Attribute ${attributeId} not found`);

    if (attribute.type === AttributeTypeEnum.COLOR && !dto.color_code) {
      throw new BadRequestException(
        'Color attribute values require color_code',
      );
    }

    const existing = await AttributeValueModel.findOne({
      where: { attribute_id: attributeId, value: dto.value },
    });
    if (existing) {
      throw new ConflictException(
        `Value "${dto.value}" already exists for this attribute`,
      );
    }

    return AttributeValueModel.create({
      attribute_id: attributeId,
      value: dto.value,
      display_value: dto.display_value,
      color_code: dto.color_code ?? null,
      swatch_image_url: dto.swatch_image_url ?? null,
      sort_order: dto.sort_order ?? 0,
      is_active: dto.is_active ?? true,
    } as any);
  }

  async updateValue(
    attributeId: number,
    valueId: number,
    dto: UpdateAttributeValueDto,
  ): Promise<AttributeValueModel> {
    const value = await AttributeValueModel.findOne({
      where: { id: valueId, attribute_id: attributeId },
    });
    if (!value) {
      throw new NotFoundException(
        `Attribute value ${valueId} not found for attribute ${attributeId}`,
      );
    }

    if (dto.value && dto.value !== value.value) {
      const clash = await AttributeValueModel.findOne({
        where: { attribute_id: attributeId, value: dto.value },
      });
      if (clash) {
        throw new ConflictException(
          `Value "${dto.value}" already exists for this attribute`,
        );
      }
    }

    await value.update(dto as any);
    return value;
  }

  async removeValue(attributeId: number, valueId: number): Promise<void> {
    const value = await AttributeValueModel.findOne({
      where: { id: valueId, attribute_id: attributeId },
    });
    if (!value) {
      throw new NotFoundException(
        `Attribute value ${valueId} not found for attribute ${attributeId}`,
      );
    }

    // Check if used by any variant
    const used = await this.sequelize.query(
      `SELECT COUNT(*)::int AS n FROM product_variant_attribute_values WHERE attribute_value_id = :id`,
      { replacements: { id: valueId }, type: 'SELECT' as any },
    );
    if (Number((used as any)[0]?.n ?? 0) > 0) {
      throw new ConflictException(
        `Cannot delete value ${valueId}: it is assigned to one or more product variants`,
      );
    }

    await value.destroy();
  }

  async reorderValues(
    attributeId: number,
    orderedIds: number[],
  ): Promise<void> {
    await this.findOne(attributeId);

    await this.sequelize.transaction(async (t) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await AttributeValueModel.update(
          { sort_order: i },
          { where: { id: orderedIds[i], attribute_id: attributeId }, transaction: t },
        );
      }
    });
  }

  // ============================================================
  // HELPERS
  // ============================================================

  private async createValuesForAttribute(
    attributeId: number,
    values: CreateAttributeValueDto[],
    t: Transaction,
  ): Promise<void> {
    // Guard against duplicate `value` within the same request
    const seen = new Set<string>();
    for (const v of values) {
      if (seen.has(v.value)) {
        throw new ConflictException(`Duplicate value "${v.value}" in payload`);
      }
      seen.add(v.value);
    }

    await AttributeValueModel.bulkCreate(
      values.map((v, i) => ({
        attribute_id: attributeId,
        value: v.value,
        display_value: v.display_value,
        color_code: v.color_code ?? null,
        swatch_image_url: v.swatch_image_url ?? null,
        sort_order: v.sort_order ?? i,
        is_active: v.is_active ?? true,
      })) as any,
      { transaction: t },
    );
  }
}
