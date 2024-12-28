import { NextFunction, Request, Response } from 'express';
import { SocietyService } from '../../../services/event/society';
import { MethodBinder } from '../../../utils';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto, SearchDto } from '../../../common/dtos';
import { IJwtUser } from '../../../interfaces/express/user.interface';

export class SocietyController {
  private societyService: SocietyService;

  constructor() {
    MethodBinder.bind(this);
    this.societyService = new SocietyService();
  }

  async createEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const societyId = (req.user as IJwtUser).sub;
      const dto = plainToInstance(CreateEventDto, {
        societyId,
        ...(req.body as Object),
      });
      const result = await this.societyService.createEvent(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async myEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const societyId = (req.user as IJwtUser).sub;
      const dto = plainToInstance(SearchDto, req.query);
      const result = await this.societyService.myEvents(societyId, dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const eventId = req.params.id;
      const result = await this.societyService.deleteEvent(eventId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAllParticipants(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
