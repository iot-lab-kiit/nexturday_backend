import { Router } from 'express';
import { VerifyTokenRoute } from './participant';
import { MethodBinder } from '../../utils';
import { SocietyRoute } from './society';

export class AuthRoute {
  public router: Router;
  private societyRoute: SocietyRoute;
  private verifyTokenRoute: VerifyTokenRoute;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.societyRoute = new SocietyRoute();
    this.verifyTokenRoute = new VerifyTokenRoute();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use('/society', this.societyRoute.router);
    this.router.use('/verify', this.verifyTokenRoute.router);
  }
}
