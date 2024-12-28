import { Router } from 'express';
import { EventController } from '../../controllers';
import { RoleMiddleware, ValidationMiddleware } from '../../middlewares';
import { SearchDto } from '../../common/dtos';
import { ParticipantRoute } from './participant';
import { SocietyRoute } from './society';

export class EventRoute {
  public router: Router;
  private eventController: EventController;
  private participantRoute: ParticipantRoute;
  private societyRoute: SocietyRoute;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.participantRoute = new ParticipantRoute();
    this.societyRoute = new SocietyRoute();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(
      '/participants',
      new RoleMiddleware('PARTICIPANT').verify,
      this.participantRoute.router,
    );
    this.router.use(
      '/society',
      new RoleMiddleware('SOCIETY').verify,
      this.societyRoute.router,
    ),
      this.router.get(
        '/',
        new ValidationMiddleware([SearchDto, 'query']).validate,
        this.eventController.getAllEvents,
      );
    this.router.get('/:id', this.eventController.getEventById);
  }
}
