import { PrismaClient } from '@prisma/client';
import { CustomError, MethodBinder } from '../../../../utils';
import { NextFunction, Request, Response } from 'express';
import {
  IParticipant,
  IUser,
} from '../../../../interfaces/express/user.interface';

export class EventAuthMiddleware {
  private prisma: PrismaClient;

  constructor() {
    MethodBinder.bind(this);
    this.prisma = new PrismaClient();
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const societyId = (req.user as IParticipant).sub;
      const eventId = req.params.id;
      if (req.user?.role === 'ADMIN') {
        next();
      }
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId,
          societyId,
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
