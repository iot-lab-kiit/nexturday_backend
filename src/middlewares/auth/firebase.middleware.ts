import { FirebaseAuthError, getAuth } from 'firebase-admin/auth';
import { CustomError, MethodBinder } from '../../utils';
import { FirebaseProvider } from '../../libs/firebase';
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { IParticipant } from '../../interfaces/express/user.interface';

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

      const participant = await this.prisma.participant.findUnique({
        where: {
          universityEmail: user.email,
        },
      });

      if (!participant) {
        throw new CustomError('participant not found', 404);
      }

      const name = user.name.split(' ');
      const email = user.email as string;

      req.user = {
        universityEmail: email,
        firstname: name[0],
        lastname: name[1],
        sub: participant?.id,
        role: 'PARTICIPANT',
        image: user?.picture,
        isKiitStudent: email.endsWith('@kiit.ac.in') ? true : false,
      } as IParticipant;

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
