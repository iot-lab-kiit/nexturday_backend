import { Router } from 'express';
import { EventController } from '../../controllers';
import { RoleMiddleware, ValidationMiddleware } from '../../middlewares';
import { CreateEventDto, SearchDto } from '../../common/dtos';
import { ParticipantRoute } from './participant';
import { SocietyRoute } from './society';
import { EventAuthMiddleware } from '../../middlewares/auth/event/society';

export class EventRoute {
  public router: Router;
  private eventController: EventController;
  private participantRoute: ParticipantRoute;
  private societyRoute: SocietyRoute;
  private eventAuthMiddleware: EventAuthMiddleware;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.participantRoute = new ParticipantRoute();
    this.societyRoute = new SocietyRoute();
    this.eventAuthMiddleware = new EventAuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.eventController.getAllEvents,
    );
    this.router.get('/:id', this.eventController.getEventById);
    this.router.use(
      '/participants',
      new RoleMiddleware('PARTICIPANT').verify,
      this.participantRoute.router,
    );
    this.router.use(new RoleMiddleware('SOCIETY').verify);
    this.router.use('/society', this.societyRoute.router);
    this.router.post(
      '/',
      new ValidationMiddleware([CreateEventDto, 'body']).validate,
      this.eventController.createEvent,
    );
    this.router.delete(
      '/:id',
      this.eventAuthMiddleware.verify,
      this.eventController.deleteEvents,
    );
  }
}
