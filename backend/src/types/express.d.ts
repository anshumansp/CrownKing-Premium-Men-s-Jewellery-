import { User as UserModel } from '../models/user.model';

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}

export {}; 