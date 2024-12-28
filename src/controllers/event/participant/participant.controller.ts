import { NextFunction, Request, Response } from 'express';
import { ParticipantService } from '../../../services/event/participant';
import { MethodBinder } from '../../../utils';
import { plainToInstance } from 'class-transformer';
import { IFirebaseUser } from '../../../interfaces/express/user.interface';
import { SearchDto } from '../../../common/dtos';

export class ParticipantController {
  private participantService: ParticipantService;

  constructor() {
    MethodBinder.bind(this);
    this.participantService = new ParticipantService();
  }

  async joinEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const uid = (req.user as IFirebaseUser).uid;
      const eventId = req.params.id;
      const result = await this.participantService.joinEvent(uid, eventId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllJoinedEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const uid = (req.user as IFirebaseUser).uid;
      const dto = plainToInstance(SearchDto, req.query);
      const result = await this.participantService.getAllJoinedEvents(uid, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
