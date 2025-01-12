import { NextFunction, Request, Response } from 'express';
import { EventService } from '../../services';
import { MethodBinder } from '../../utils';
import { plainToInstance } from 'class-transformer';
import { CreateEventDto, SearchDto } from '../../common/dtos';
import { IUser } from '../../interfaces/express/user.interface';

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

  async createEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const societyId = (req.user as IUser).sub;
      const dto = plainToInstance(CreateEventDto, {
        societyId,
        ...(req.body as Object),
      });
      const images = req.files as Express.Multer.File[] | undefined;
      const result = await this.eventService.createEvent(dto, images);
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
      const result = await this.eventService.deleteEvent(eventId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
