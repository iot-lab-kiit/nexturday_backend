import { Router } from 'express';
import { ParticipantController } from '../../../controllers/event/participant';
import { MethodBinder } from '../../../utils';
import { ValidationMiddleware } from '../../../middlewares';
import { SearchDto } from '../../../common/dtos';
import { FavoriteRoute } from './favorite.route';

export class ParticipantRoute {
  public router: Router;
  private participantController: ParticipantController;
  private favoriteRoute: FavoriteRoute;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.participantController = new ParticipantController();
    this.favoriteRoute = new FavoriteRoute();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use('favorite', this.favoriteRoute.router);
    this.router.post('/:id', this.participantController.joinEvent);
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.participantController.getAllJoinedEvents,
    );
  }
}
