import { Application } from 'express';
import { HomeRoute } from './home.route';
import {
  FirebaseMiddleware,
  GlobalErrorMiddleware,
  NotFoundMiddleware,
  PrismaErrorMiddleware,
} from '../middlewares';
import { ParticipantRoute } from './participant';

export class Routes {
  private homeRoute: HomeRoute;
  private firebaseMiddleware: FirebaseMiddleware;
  private participantRoute: ParticipantRoute;

  constructor(private app: Application) {
    this.homeRoute = new HomeRoute();
    this.firebaseMiddleware = new FirebaseMiddleware();
    this.participantRoute = new ParticipantRoute();

    this.app.use('/api', this.homeRoute.router);
    this.app.use(
      '/api/participants',
      this.firebaseMiddleware.verify,
      this.participantRoute.router,
    );
    this.app.use(NotFoundMiddleware.handle);
    this.app.use(PrismaErrorMiddleware.handle);
    this.app.use(GlobalErrorMiddleware.handle);
  }
}
