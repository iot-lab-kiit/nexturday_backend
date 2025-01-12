import { NextFunction, Request, Response } from 'express';
import { CustomError, MethodBinder } from '../../utils';
import { FirebaseMiddleware } from './firebase.middleware';
import { JWTMiddleware } from './jwt.middleware';

export class CombinedAuthMiddleware {
  private firebaseMiddleware: FirebaseMiddleware;
  private jwtMiddleware: JWTMiddleware;

  constructor() {
    MethodBinder.bind(this);
    this.firebaseMiddleware = new FirebaseMiddleware(false);
    this.jwtMiddleware = new JWTMiddleware(false);
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      await this.firebaseMiddleware.verify(req, res, next);
      next();
    } catch (firebaseError) {
      try {
        await this.jwtMiddleware.verify(req, res, next);
        next();
      } catch (jwtError) {
        next(jwtError);
      }
    }
  }
}
