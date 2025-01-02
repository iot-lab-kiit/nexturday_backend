import { Router } from 'express';
import {SocietyController} from "../../controllers/event/society";
import {EventAuthMiddleware} from "../../middlewares/auth/event/society";
import {MethodBinder} from "../../utils";
import {ValidationMiddleware} from "../../middlewares";
import {CreateEventDto, SearchDto} from "../../common/dtos";
import {loginDto, signupDto} from "../../common/dtos/login";
import {LoginController} from "../../controllers/login";


export class AuthRoute {
  public router: Router;
  private loginController: LoginController;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.loginController = new LoginController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/login',
      new ValidationMiddleware([loginDto, 'body']).validate,
      this.loginController.login,
    );
    this.router.post(
        '/signup',
        new ValidationMiddleware([signupDto, 'body']).validate,
        this.loginController.signup,
    );

  }
}
