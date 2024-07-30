import { SetMetadata } from '@nestjs/common';

export const VENDOR_ROLES_KEY = 'vendor_roles';
export const VendorRoles = (...roles: string[]) =>
  SetMetadata(VENDOR_ROLES_KEY, roles);
