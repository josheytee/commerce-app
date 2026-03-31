import { RoleModel } from 'src/infrastructure/database/models/role.model';
import { VendorModel } from 'src/infrastructure/database/models/vendor.model';
import { StoreModel } from 'src/infrastructure/database/models/store.model';


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
    roles?: RoleModel[];
    stores?: StoreModel[];
    // Add any other fields you need from the User model
}

export interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}
