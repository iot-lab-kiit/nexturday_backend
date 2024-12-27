import { NextFunction, Request, Response } from 'express';
import { MethodBinder } from '../../utils';
import { FirebaseMiddleware } from './firebase.middleware';
import { JWTMiddleware } from './jwt.middleware';

export class CombinedAuthMiddleware {
  private firebaseMiddleware: FirebaseMiddleware;
  private jwtMiddleware: JWTMiddleware;

  constructor() {
    MethodBinder.bind(this);
    this.firebaseMiddleware = new FirebaseMiddleware();
    this.jwtMiddleware = new JWTMiddleware();
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      await this.firebaseMiddleware.verify(req, res, next);
      return;
    } catch (firebaseError) {
      try {
        this.jwtMiddleware.verify(req, res, next);
        return;
      } catch (jwtError) {
        return res.status(401).json({ message: 'Unauthorized Exception' });
      }
    }
  }
}
