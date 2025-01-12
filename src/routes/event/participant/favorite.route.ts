import { Router } from 'express';
import { FavoriteController } from '../../../controllers/event/participant';
import { MethodBinder } from '../../../utils';
import { ValidationMiddleware } from '../../../middlewares';
import { SearchDto } from '../../../common/dtos';
import { FavoriteAuthMiddleware } from '../../../middlewares/auth/event/participant';

export class FavoriteRoute {
  public router: Router;
  private favoriteController: FavoriteController;
  private favoriteAuthMiddleware: FavoriteAuthMiddleware;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.favoriteController = new FavoriteController();
    this.favoriteAuthMiddleware = new FavoriteAuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/:id', this.favoriteController.favoriteEvent);
    this.router.delete(
      '/:id',
      this.favoriteAuthMiddleware.verify,
      this.favoriteController.unfavoriteEvent,
    );
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.favoriteController.getAllFavoriteEvents,
    );
  }
}
