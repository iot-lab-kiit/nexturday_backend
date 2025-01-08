import { Router } from 'express';
import { MethodBinder } from '../../../utils';
import { ValidationMiddleware } from '../../../middlewares';
import { SearchDto } from '../../../common/dtos';
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
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.societyController.myEvents,
    );
    this.router.get(
      '/:id/participants',
      this.eventAuthMiddleware.verify,
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.societyController.getAllParticipants,
    );
  }
}
