import { Application } from 'express';
import { HomeRoute } from './home.route';
import {
  CombinedAuthMiddleware,
  FirebaseMiddleware,
  GlobalErrorMiddleware,
  NotFoundMiddleware,
  PrismaErrorMiddleware,
} from '../middlewares';
import { ParticipantRoute } from './participant';
import { EventRoute } from './event';

export class Routes {
  private homeRoute: HomeRoute;
  private firebaseMiddleware: FirebaseMiddleware;
  private combinedAuthMiddleware: CombinedAuthMiddleware;
  private participantRoute: ParticipantRoute;
  private eventRoute: EventRoute;

  constructor(private app: Application) {
    this.homeRoute = new HomeRoute();
    this.firebaseMiddleware = new FirebaseMiddleware();
    this.combinedAuthMiddleware = new CombinedAuthMiddleware();
    this.participantRoute = new ParticipantRoute();
    this.eventRoute = new EventRoute();

    this.app.use('/api', this.homeRoute.router);
    this.app.use(
      '/api/participants',
      this.firebaseMiddleware.verify,
      this.participantRoute.router,
    );
    this.app.use(
      '/api/events',
      this.combinedAuthMiddleware.verify,
      this.eventRoute.router,
    );
    this.app.use(NotFoundMiddleware.handle);
    this.app.use(PrismaErrorMiddleware.handle);
    this.app.use(GlobalErrorMiddleware.handle);
  }
}
