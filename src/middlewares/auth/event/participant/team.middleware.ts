import { PrismaClient } from '@prisma/client';
import { CustomError, MethodBinder } from '../../../../utils';
import { NextFunction, Request, Response } from 'express';
import {
  IParticipant,
  IUser,
} from '../../../../interfaces/express/user.interface';

export class TeamAuthMiddleware {
  private prisma: PrismaClient;

  constructor() {
    MethodBinder.bind(this);
    this.prisma = new PrismaClient();
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const participantId = (req.user as IParticipant).sub;
      const teamId = req.params.id;
      const team = await this.prisma.team.findFirst({
        where: {
          AND: [
            {
              id: teamId,
            },
            {
              OR: [
                {
                  leaderId: participantId,
                },
                {
                  members: {
                    some: {
                      participantId,
                    },
                  },
                },
              ],
            },
          ],
        },
      });
      if (!team) {
        throw new CustomError('Unauthorized Exception', 401);
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}
