import { Role } from 'src/account/role/models/role.model';
import { Vendor } from 'src/account/vendor/vendor.model';
import { Store } from 'src/store/models/store.model';

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
    vendors?: Vendor[];
    roles?: Role[];
    stores?: Store[];
    // Add any other fields you need from the User model
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}
