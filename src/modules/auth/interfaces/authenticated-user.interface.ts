import { RoleModel } from 'src/infrastructure/database/models/role.model';
import { VendorModel } from 'src/infrastructure/database/models/vendor.model';
import { StoreModel } from 'src/infrastructure/database/models/store.model';
import { CustomerModel } from 'src/infrastructure';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { VendorRepository } from 'src/infrastructure/database/repositories/vendor.repository';


export interface AuthenticatedUser {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    gender?: string;
    phone_number?: string;
    dob?: string;
    verified_at?: string;
    last_login?: string;
    vendors?: VendorModel[];
    customer?: CustomerModel;
    roles?: RoleModel[];
    stores?: StoreModel[];

    // Add any other fields you need from the User model
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}


export function requireCustomerId(req: AuthenticatedRequest): number {
    const id = req.user?.customer?.id;
    if (!id) throw new BadRequestException('Customer ID not found');
    return id;
}

export function requireUserId(req: AuthenticatedRequest): number {
    const id = req.user?.id;
    if (!id) throw new BadRequestException('User ID not found');
    return id;
}

/**
 * Assert the authenticated user owns the vendor identified by `pathVendorId`.
 *
 * Users may own multiple vendors. The JWT *may* contain a hint list
 * (`user.vendorIds`), but we still verify against the DB to catch ownership
 * changes that happened after token issuance.
 *
 * Returns the verified vendorId, or throws:
 *   - 403 if the vendor exists but is not owned by this user
 *   - 404 if the vendor does not exist
 *
 * Note: we deliberately return the *same* error shape for "not yours" and
 * "not found" when we can't distinguish safely — see the controller for how
 * this is used.
 */
export async function assertUserOwnsVendor(
    req: AuthenticatedRequest,
    pathVendorId: number,
    vendorRepo: VendorRepository,
): Promise<number> {
    const userId = requireUserId(req);

    const vendor = await vendorRepo.findById(pathVendorId);
    if (!vendor) {
        throw new NotFoundException('Vendor not found');
    }

    if (vendor.user_id !== userId) {
        // Do NOT leak existence. Treat as not found.
        throw new NotFoundException('Vendor not found');
    }

    return pathVendorId;
}
