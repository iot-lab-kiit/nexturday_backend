import { Application } from 'express';
import { HomeRoute } from './home.route';
import {
  CombinedAuthMiddleware,
  FirebaseMiddleware,
  GlobalErrorMiddleware,
  JWTMiddleware,
  NotFoundMiddleware,
  PrismaErrorMiddleware,
} from '../middlewares';
import { ParticipantRoute } from './participant';
import { EventRoute } from './event';
import { AuthRoute } from './auth';
import { SocietyRoute } from './society';

export class Routes {
  private homeRoute: HomeRoute;
  private firebaseMiddleware: FirebaseMiddleware;
  private combinedAuthMiddleware: CombinedAuthMiddleware;
  private participantRoute: ParticipantRoute;
  private authRoute: AuthRoute;
  private eventRoute: EventRoute;
  private societyRoute: SocietyRoute;
  private jwtMiddlware: JWTMiddleware;

  constructor(private app: Application) {
    this.homeRoute = new HomeRoute();
    this.firebaseMiddleware = new FirebaseMiddleware();
    this.combinedAuthMiddleware = new CombinedAuthMiddleware();
    this.participantRoute = new ParticipantRoute();
    this.authRoute = new AuthRoute();
    this.eventRoute = new EventRoute();
    this.societyRoute = new SocietyRoute();
    this.jwtMiddlware = new JWTMiddleware();

    this.app.use('/api', this.homeRoute.router);
    this.app.use(
      '/api/participants',
      this.firebaseMiddleware.verify,
      this.participantRoute.router,
    );
    this.app.use(
      '/api/society',
      this.jwtMiddlware.verify,
      this.societyRoute.router,
    );
    this.app.use(
      '/api/events',
      this.combinedAuthMiddleware.verify,
      this.eventRoute.router,
    );
    this.app.use('/api/auth', this.authRoute.router);
    this.app.use(NotFoundMiddleware.handle);
    this.app.use(PrismaErrorMiddleware.handle);
    this.app.use(GlobalErrorMiddleware.handle);
  }
}
