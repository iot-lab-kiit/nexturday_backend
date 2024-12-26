import { Application } from 'express';
import { HomeRoute } from './home.route';
import {
  FirebaseMiddleware,
  GlobalErrorMiddleware,
  NotFoundMiddleware,
  PrismaErrorMiddleware,
} from '../middlewares';

export class Routes {
  private homeRoute: HomeRoute;
  private firebaseMiddleware: FirebaseMiddleware;

  constructor(private app: Application) {
    this.homeRoute = new HomeRoute();
    this.firebaseMiddleware = new FirebaseMiddleware();

    this.app.use(this.firebaseMiddleware.verify);
    this.app.use('/api', this.homeRoute.router);
    this.app.use(NotFoundMiddleware.handle);
    this.app.use(PrismaErrorMiddleware.handle);
    this.app.use(GlobalErrorMiddleware.handle);
  }
}
