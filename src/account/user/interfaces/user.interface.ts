export interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  email: string;
  gender?: string;
  phone_number?: string;
  dob?: string;
  verified_at?: string;
  last_login?: string;
  password_hash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
