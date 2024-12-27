import { FirebaseAuthError, getAuth } from 'firebase-admin/auth';
import { CustomError, MethodBinder } from '../../utils';
import { FirebaseProvider } from '../../libs/firebase';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { IFirebaseUser } from '../../interfaces/express/user.interface';

export class FirebaseMiddleware {
  private firebaseProvider: typeof FirebaseProvider;
  private prisma: PrismaClient;

  constructor() {
    MethodBinder.bind(this);
    this.firebaseProvider = FirebaseProvider;
    this.prisma = new PrismaClient();
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Authorization token is required', 401);
    }

    const token = req.headers.authorization?.split(' ')[1] as string;
    try {
      const user = await getAuth(this.firebaseProvider.firebase).verifyIdToken(
        token,
      );

      if (!user.email?.endsWith('@kiit.ac.in')) {
        throw new CustomError('kiit email allowed', 401);
      }

      req.user = {
        email: user.email,
        name: user.name,
        uid: user.uid,
        image: user?.picture,
      } as IFirebaseUser;
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
