import { Request } from 'express';
import { IFirebaseUser, IJwtUser } from './user.interface';

declare module 'express' {
  interface Request {
    user?: IFirebaseUser | IJwtUser;
  }
}
