import { Router } from 'express';
import { MethodBinder } from '../../utils';
import { ValidationMiddleware } from '../../middlewares';
import { loginDto, signupDto } from '../../common/dtos/login';
import { AuthController } from '../../controllers/auth';
import { VerifyTokenRoute } from './participant';

export class AuthRoute {
  public router: Router;
  private authController: AuthController;
  private verifyTokenRoute: VerifyTokenRoute;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.authController = new AuthController();
    this.verifyTokenRoute = new VerifyTokenRoute();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/login',
      new ValidationMiddleware([loginDto, 'body']).validate,
      this.authController.login,
    );
    this.router.post(
      '/signup',
      new ValidationMiddleware([signupDto, 'body']).validate,
      this.authController.signup,
    );
    this.router.use('/verify', this.verifyTokenRoute.router);
  }
}
