import { Router } from 'express';
import { EventController } from '../../controllers';
import { RoleMiddleware, ValidationMiddleware } from '../../middlewares';
import { SearchDto } from '../../common/dtos';
import { ParticipantRoute } from './participant';

export class EventRoute {
  public router: Router;
  private eventController: EventController;
  private participantRoute: ParticipantRoute;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.participantRoute = new ParticipantRoute();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(
      '/participants',
      new RoleMiddleware('PARTICIPANT').verify,
      this.participantRoute.router,
    );
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.eventController.getAllEvents,
    );
    this.router.get('/:id', this.eventController.getEventById);
  }
}
