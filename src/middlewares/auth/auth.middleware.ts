import { FirebaseAuthError, getAuth } from 'firebase-admin/auth';
import { MethodBinder } from '../../utils';
import { FirebaseProvider } from '../../libs/firebase';
import { NextFunction, Request, Response } from 'express';

export class AuthMiddleware {
  private firebaseProvider: typeof FirebaseProvider;

  constructor() {
    MethodBinder.bind(this);
    this.firebaseProvider = FirebaseProvider;
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization == null)
      return res.status(401).json({
        success: false,
        message: 'token is required',
      });

    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'token is required',
      });
    }
    try {
      const user = await getAuth(this.firebaseProvider.firebase).verifyIdToken(
        token,
      );
      if (!user.email?.endsWith('@kiit.ac.in')) {
        return res.status(401).json({
          success: false,
          message: 'kiit email allowed',
        });
      }

      req.user = {
        email: user.email,
        name: user.name,
        uid: user.uid,
        picture: user?.picture,
      };
      next();
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        return res.status(401).json({
          success: false,
          message: 'Token validation failed',
        });
      }
      res.status(500).json({
        success: false,
        message: 'internal server error',
      });
    }
  }
}
