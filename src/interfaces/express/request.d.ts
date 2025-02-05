import { Request } from 'express';
import { IParticipant, ISociety } from './user.interface';

declare module 'express' {
  interface Request {
    user?: IParticipant | ISociety;
  }
}
