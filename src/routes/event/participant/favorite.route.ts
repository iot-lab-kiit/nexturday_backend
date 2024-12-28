import { Router } from 'express';
import { FavoriteController } from '../../../controllers/event/participant';
import { MethodBinder } from '../../../utils';
import { ValidationMiddleware } from '../../../middlewares';
import { SearchDto } from '../../../common/dtos';

export class FavoriteRoute {
  public router: Router;
  private favoriteController: FavoriteController;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.favoriteController = new FavoriteController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/:id', this.favoriteController.favoriteEvent);
    this.router.delete('/:id', this.favoriteController.unfavoriteEvent);
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.favoriteController.getAllFavoriteEvents,
    );
  }
}
