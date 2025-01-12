import { FirebaseAuthError, getAuth } from 'firebase-admin/auth';
import { CustomError, MethodBinder } from '../../utils';
import { FirebaseProvider } from '../../libs/firebase';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

export class FirebaseMiddleware {
  private firebaseProvider: typeof FirebaseProvider;
  private prisma: PrismaClient;
  private handleError: boolean;

  constructor(handleError = true) {
    MethodBinder.bind(this);
    this.firebaseProvider = FirebaseProvider;
    this.prisma = new PrismaClient();
    this.handleError = handleError;
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError('Authorization token is required', 401);
      }
      const token = req.headers.authorization?.split(' ')[1] as string;

      const user = await getAuth(this.firebaseProvider.firebase).verifyIdToken(
        token,
      );

      if (!user.email?.endsWith('@kiit.ac.in')) {
        throw new CustomError('kiit email allowed', 401);
      }

      const participant = await this.prisma.participant.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!participant) {
        throw new CustomError('participant not found', 404);
      }

      req.user = {
        email: user.email,
        name: user.name,
        sub: participant?.id,
        role: 'PARTICIPANT',
        image: user?.picture,
      };
      if (this.handleError) {
        next();
      }
    } catch (error) {
      if (this.handleError) {
        if (error instanceof FirebaseAuthError) {
          return res.status(401).json({
            success: false,
            message: 'Token validation failed',
          });
        }
        next(error);
      } else {
        throw error;
      }
    }
  }
}
