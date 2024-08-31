import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    username: string;
    // Add other properties as needed
  };
  session: {
    id: number;
    user_id: number;
  };
}
