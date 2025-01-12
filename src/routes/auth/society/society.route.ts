import { Router } from 'express';
import { MethodBinder } from '../../../utils';
import { ValidationMiddleware } from '../../../middlewares';
import { SocietyController } from '../../../controllers/auth/society';
import { LoginDto, SignupDto } from '../../../common/dtos/auth/society';

export class SocietyRoute {
  public router: Router;
  private societyController: SocietyController;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.societyController = new SocietyController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/login',
      new ValidationMiddleware([LoginDto, 'body']).validate,
      this.societyController.login,
    );
    this.router.post(
      '/signup',
      new ValidationMiddleware([SignupDto, 'body']).validate,
      this.societyController.signup,
    );
  }
}
