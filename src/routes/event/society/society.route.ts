import { Router } from 'express';
import { MethodBinder } from '../../../utils';
import { ValidationMiddleware } from '../../../middlewares';
import { CreateEventDto, SearchDto } from '../../../common/dtos';
import { SocietyController } from '../../../controllers/event/society';
import { EventAuthMiddleware } from '../../../middlewares/auth/event/society';

export class SocietyRoute {
  public router: Router;
  private societyController: SocietyController;
  private eventAuthMiddleware: EventAuthMiddleware;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.societyController = new SocietyController();
    this.eventAuthMiddleware = new EventAuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/',
      new ValidationMiddleware([CreateEventDto, 'body']).validate,
      this.societyController.createEvent,
    );
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.societyController.myEvents,
    );
    this.router.delete(
      '/:id',
      this.eventAuthMiddleware.verify,
      this.societyController.deleteEvents,
    );
    this.router.get(
      '/:id/participants',
      this.eventAuthMiddleware.verify,
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.societyController.getAllParticipants,
    );
  }
}
