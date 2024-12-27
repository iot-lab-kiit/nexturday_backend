import { NextFunction, Request, Response } from 'express';
import { EventService } from '../../services';
import { MethodBinder } from '../../utils';
import { plainToInstance } from 'class-transformer';
import { SearchDto } from '../../common/dtos';

export class EventController {
  private eventService: EventService;

  constructor() {
    MethodBinder.bind(this);
    this.eventService = new EventService();
  }

  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(SearchDto, req.query);
      const result = await this.eventService.getAllEvents(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.eventService.getEventById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
