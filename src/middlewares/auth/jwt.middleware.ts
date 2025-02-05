import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { ISociety, IUser } from '../../interfaces/express/user.interface';
import { CustomError, MethodBinder } from '../../utils';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

export class JWTMiddleware {
  private prisma: PrismaClient;
  private handleError: boolean;

  constructor(handleError = true) {
    MethodBinder.bind(this);
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

      const user = verify(token, process.env.JWT_SECRET as string) as ISociety;

      const society = await this.prisma.society.findUnique({
        where: {
          email: user.email,
        },
      });

      if (!society) {
        throw new CustomError('society not found', 404);
      }

      req.user = {
        email: user.email,
        name: user.name,
        sub: user.sub,
        role: 'SOCIETY',
        image: user?.image,
      };
      if (this.handleError) {
        next();
      }
    } catch (error) {
      if (this.handleError) {
        if (error instanceof JsonWebTokenError) {
          return res.status(401).json({
            success: false,
            message: 'invalid token',
          });
        }
        next(error);
      } else {
        throw error;
      }
    }
  }
}
