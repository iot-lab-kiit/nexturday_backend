import { PrismaClient } from '@prisma/client';
import { CustomError, MethodBinder } from '../../../../utils';
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../../../../interfaces/express/user.interface';

export class FavoriteAuthMiddleware {
  private prisma: PrismaClient;

  constructor() {
    MethodBinder.bind(this);
    this.prisma = new PrismaClient();
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const participantId = (req.user as IUser).sub;
      const eventId = req.params.id;
      const event = await this.prisma.favoriteEvent.findUnique({
        where: {
          participantId_eventId: {
            eventId,
            participantId,
          },
        },
      });
      if (!event) {
        throw new CustomError('Unauthorized Exception', 401);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
