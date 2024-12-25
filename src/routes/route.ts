import { Application } from 'express';
import { HomeRoute } from './home.route';
import {
  AuthMiddleware,
  GlobalErrorMiddleware,
  NotFoundMiddleware,
  PrismaErrorMiddleware,
} from '../middlewares';

export class Routes {
  private homeRoute: HomeRoute;
  private authMiddleware: AuthMiddleware;

  constructor(private app: Application) {
    this.homeRoute = new HomeRoute();
    this.authMiddleware = new AuthMiddleware();

    this.app.use(this.authMiddleware.verify);
    this.app.use('/api', this.homeRoute.router);
    this.app.use(NotFoundMiddleware.handle);
    this.app.use(PrismaErrorMiddleware.handle);
    this.app.use(GlobalErrorMiddleware.handle);
  }
}
