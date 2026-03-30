import { Role } from "src/modules/user/role/models/role.model";
import { Vendor } from "src/modules/vendor/onboarding/vendor.model";
import { Store } from "src/modules/vendor/store/models/store.model";


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
