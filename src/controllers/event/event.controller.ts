import { NextFunction, Request, Response } from 'express';
import { EventService } from '../../services';
import { MethodBinder } from '../../utils';
import { plainToInstance } from 'class-transformer';
import { EventDto, SearchDto, UpdateEventDto } from '../../common/dtos';
import {
  IParticipant,
  ISociety,
} from '../../interfaces/express/user.interface';
import { PaymentStatusUpdateDto } from '../../common/dtos';

export class EventController {
  private eventService: EventService;

  constructor() {
    MethodBinder.bind(this);
    this.eventService = new EventService();
  }

  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(SearchDto, req.query);
      const result = await this.eventService.getAllEvents(
        dto,
        req.user?.role as string,
        (req.user as IParticipant).isKiitStudent,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateTeamPaymentStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const teamId = req.params.id;
      const dto = plainToInstance(PaymentStatusUpdateDto, {
        teamId,
        ...(req.body as Object),
      });
      const result = await this.eventService.updateTeamPaymentStatus(dto.teamId, dto.paymentStatus);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.eventService.getEventById(
        req.user?.sub as string,
        req.user?.role as string,
        req.params.id,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async crousel(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.eventService.crousel();
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
      const societyId = (req.user as ISociety).sub;
      const dto = plainToInstance(EventDto, {
        societyId,
        ...(req.body as Object),
      });
      const images = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )['images'];
      const paymentQr = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )['paymentQr'];
      const result = await this.eventService.createEvent(
        dto,
        images,
        paymentQr,
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const eventId = req.params.id;
      const dto = plainToInstance(UpdateEventDto, {
        eventId,
        ...(req.body as Object),
      });
      const images = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )['images'];
      const paymentQr = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )['paymentQr'];
      const result = await this.eventService.updateEvent(
        dto,
        images,
        paymentQr,
      );
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
