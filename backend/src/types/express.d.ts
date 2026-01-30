// src/types/express.d.ts
import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      /**
       * Optional authenticated user information attached by authentication middleware.
       */
      user?: { id: string; role?: string };
    }
  }
}
