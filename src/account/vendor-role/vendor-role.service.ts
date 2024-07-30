import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vendor } from '../vendor/vendor.model';
import { AssignRoleDto } from './assign-role.dto'; // Adjust the path as needed
import { Role } from '../role/models/role.model';
import { VendorRole } from '../role/models/vendor-role.model';

@Injectable()
export class VendorRoleService {
  constructor(
    @InjectModel(VendorRole)
    private vendorRoleModel: typeof VendorRole,
    @InjectModel(Vendor)
    private vendorModel: typeof Vendor,
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  async assignRole(assignRoleDto: AssignRoleDto): Promise<VendorRole> {
    const { vendorId, roleId } = assignRoleDto;

    // Validate vendor existence
    const vendor = await this.vendorModel.findByPk(vendorId);
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    // Validate role existence
    const role = await this.roleModel.findByPk(roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Check if the role is already assigned to the vendor
    const existingVendorRole = await this.vendorRoleModel.findOne({
      where: { vendor_id: vendorId, role_id: roleId },
    });
    if (existingVendorRole) {
      throw new ForbiddenException('Role is already assigned to the vendor');
    }

    // Assign the role to the vendor
    return this.vendorRoleModel.create({
      vendor_id: vendorId,
      role_id: roleId,
    });
  }
}
