import { Router } from 'express';
import { EventController } from '../../controllers';
import {
  RoleMiddleware,
  UploaderMiddleware,
  ValidationMiddleware,
} from '../../middlewares';
import { EventDto, SearchDto, UpdateEventDto } from '../../common/dtos';
import { ParticipantRoute } from './participant';
import { SocietyRoute } from './society';
import { EventAuthMiddleware } from '../../middlewares/auth/event/society';
import { TOTAL_IMAGES } from '../../common/constants';

export class EventRoute {
  public router: Router;
  private eventController: EventController;
  private participantRoute: ParticipantRoute;
  private societyRoute: SocietyRoute;
  private eventAuthMiddleware: EventAuthMiddleware;
  private uploaderMiddleware: UploaderMiddleware;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.participantRoute = new ParticipantRoute();
    this.societyRoute = new SocietyRoute();
    this.eventAuthMiddleware = new EventAuthMiddleware();
    this.uploaderMiddleware = new UploaderMiddleware();

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
    );
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.eventController.getAllEvents,
    );
    this.router.get('/crousel', this.eventController.crousel);
    this.router.get('/:id', this.eventController.getEventById);
    this.router.use(new RoleMiddleware('SOCIETY').verify);
    this.router.post(
      '/',
      this.uploaderMiddleware.uploader.array('images', TOTAL_IMAGES),
      new ValidationMiddleware([EventDto, 'body']).validate,
      this.eventController.createEvent,
    );
    this.router.patch(
      '/:id',
      this.eventAuthMiddleware.verify,
      this.uploaderMiddleware.uploader.array('images', TOTAL_IMAGES),
      new ValidationMiddleware([UpdateEventDto, 'body']).validate,
      this.eventController.updateEvent,
    );
    this.router.delete(
      '/:id',
      this.eventAuthMiddleware.verify,
      this.eventController.deleteEvents,
    );
  }
}
