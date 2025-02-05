import { NextFunction, Request, Response } from 'express';
import { MethodBinder } from '../../../utils';
import { IParticipant } from '../../../interfaces/express/user.interface';
import { FavoriteService } from '../../../services/event/participant';
import { plainToInstance } from 'class-transformer';
import { SearchDto } from '../../../common/dtos';

export class FavoriteController {
  private favoriteService: FavoriteService;

  constructor() {
    MethodBinder.bind(this);
    this.favoriteService = new FavoriteService();
  }

  async favoriteEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const participantId = (req.user as IParticipant).sub;
      const eventId = req.params.id;
      const result = await this.favoriteService.favoriteEvent(
        participantId,
        eventId,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async unfavoriteEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const participantId = (req.user as IParticipant).sub;
      const eventId = req.params.id;
      const result = await this.favoriteService.unfavoriteEvent(
        participantId,
        eventId,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllFavoriteEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const participantId = (req.user as IParticipant).sub;
      const dto = plainToInstance(SearchDto, req.query);
      const result = await this.favoriteService.getAllFavoriteEvents(
        participantId,
        dto,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
