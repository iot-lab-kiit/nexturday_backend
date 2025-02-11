import { NextFunction, Request, Response } from 'express';
import { MethodBinder } from '../../utils';
import { plainToInstance } from 'class-transformer';
import { EventSearchDto } from '../../common/dtos';
import { AdminService } from '../../services/admin';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    MethodBinder.bind(this);
    this.adminService = new AdminService();
  }

  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = plainToInstance(EventSearchDto, req.query);
      const result = await this.adminService.getAllEvents(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async approveEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id;
      const result = await this.adminService.approveEvent(eventId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async rejectEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id;
      const result = await this.adminService.rejectEvent(eventId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
