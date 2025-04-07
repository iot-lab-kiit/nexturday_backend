import { NextFunction, Request, Response } from 'express';
import { SocietyService } from '../../../services/event/society';
import { MethodBinder } from '../../../utils';
import { plainToInstance } from 'class-transformer';
import { SearchDto } from '../../../common/dtos';
import { ISociety } from '../../../interfaces/express/user.interface';

export class SocietyController {
  private societyService: SocietyService;

  constructor() {
    MethodBinder.bind(this);
    this.societyService = new SocietyService();
  }

  async myEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const societyId = (req.user as ISociety).sub;
      const dto = plainToInstance(SearchDto, req.query);
      const result = await this.societyService.myEvents(societyId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllParticipants(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const eventId = req.params.id;
      const dto = plainToInstance(SearchDto, req.query);
      const result = await this.societyService.getAllParticipants(eventId, dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
