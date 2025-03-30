import { Router } from 'express';
import { VerifyTokenController } from '../../../controllers/auth/participant';
import { MethodBinder } from '../../../utils';

export class VerifyTokenRoute {
  public router: Router;
  private verifyTokenController: VerifyTokenController;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.verifyTokenController = new VerifyTokenController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.verifyTokenController.verifyToken);
  }
}
