import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  AttributeModel,
  AttributeValueModel,
  ProductVariantAttributeValueModel,
} from 'src/infrastructure';
import { CreateAttributeDto } from './dto/create_attribute.dto';
import { UpdateAttributeDto } from './dto/update_attribute.dto';
import { Op } from 'sequelize';
import { buildFilters } from './utils/query.utils';
import { ListAttributeDto } from './dto/list-attribute.dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(AttributeModel)
    private readonly attributeModel: typeof AttributeModel,
  ) { }

  async create(
    createAttributeDto: CreateAttributeDto,
  ): Promise<AttributeModel> {
    return this.attributeModel.create(createAttributeDto);
  }

  async findAll(): Promise<AttributeModel[]> {
    return this.attributeModel.findAll();
  }

  async findOne(id: number): Promise<AttributeModel> {
    return this.attributeModel.findByPk(id);
  }

  async remove(id: number): Promise<void> {
    const attribute = await this.findOne(id);
    await attribute.destroy();
  }

  // Vendor creates their own attribute
  async createForVendor(vendorId: number, dto: CreateAttributeDto) {
    return AttributeModel.create({
      ...dto,
      vendor_id: vendorId,
      is_locked: false, // vendors can't lock their own
    });
  }

  // Admin creates a platform attribute
  async createPlatform(dto: CreateAttributeDto) {
    return AttributeModel.create({
      ...dto,
      vendor_id: null,
      is_locked: false,
    });
  }

  // Update — ownership check
  async update(
    attributeId: number,
    actor: { vendorId?: number; isAdmin: boolean },
    dto: UpdateAttributeDto,
  ) {
    const attr = await AttributeModel.findByPk(attributeId);
    if (!attr) throw new NotFoundException();

    // Vendor can only edit their own, non-locked attributes
    if (!actor.isAdmin) {
      if (attr.vendor_id !== actor.vendorId) {
        throw new ForbiddenException("Cannot edit another vendor's attribute");
      }
      if (attr.is_locked) {
        throw new ForbiddenException('Attribute is locked by the platform');
      }
    }

    // Prevent vendor from changing ownership
    if (!actor.isAdmin && dto.vendor_id !== undefined) {
      delete dto.vendor_id;
    }

    await attr.update(dto);
    return attr;
  }

  // List — vendor sees platform + their own
  async listForVendor(vendorId: number, filters: ListAttributeDto) {
    return AttributeModel.findAll({
      where: {
        [Op.or]: [
          { vendor_id: null }, // platform
          { vendor_id: vendorId }, // own
        ],
        ...buildFilters(filters),
      },
      include: [{ model: AttributeValueModel, as: 'values' }],
      order: [
        ['sort_order', 'ASC'],
        [{ model: AttributeValueModel, as: 'values' }, 'sort_order', 'ASC'],
      ],
    });
  }

  // product-variant-attribute-values.service.ts
  async attachAttributeValue(
    variantId: number,
    attributeId: number,
    attributeValueId: number,
    vendorId: number,
  ) {
    const attribute = await AttributeModel.findByPk(attributeId);
    const value = await AttributeValueModel.findByPk(attributeValueId);

    if (!attribute || !value) throw new NotFoundException();

    // Attribute must belong to the platform or to this vendor
    if (attribute.vendor_id !== null && attribute.vendor_id !== vendorId) {
      throw new ForbiddenException('Attribute belongs to another vendor');
    }

    // Value must belong to the attribute
    if (value.attribute_id !== attributeId) {
      throw new BadRequestException('Value does not belong to attribute');
    }

    return ProductVariantAttributeValueModel.create({
      variant_id: variantId,
      attribute_id: attributeId,
      attribute_value_id: attributeValueId,
    });
  }
}
