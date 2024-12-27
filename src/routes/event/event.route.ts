import { Router } from 'express';
import { EventController } from '../../controllers';
import { ValidationMiddleware } from '../../middlewares';
import { SearchDto } from '../../common/dtos';

export class EventRoute {
  public router: Router;
  private eventController: EventController;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.eventController.getAllEvents,
    );
    this.router.get('/:id', this.eventController.getEventById);
  }
}
