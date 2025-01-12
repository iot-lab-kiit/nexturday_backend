import { Router } from 'express';
import { SocietyController } from '../../controllers/society';
import { RoleMiddleware, ValidationMiddleware } from '../../middlewares';
import { UpdateSocietyDto } from '../../common/dtos/society';

export class SocietyRoute {
  public router: Router;
  private societyController: SocietyController;
  private roleMiddleware: RoleMiddleware;

  constructor() {
    this.router = Router();
    this.societyController = new SocietyController();
    this.roleMiddleware = new RoleMiddleware('SOCIETY');

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(this.roleMiddleware.verify);
    this.router.get('/', this.societyController.getProfile);
    this.router.delete('/', this.societyController.deleteProfile);
    this.router.patch(
      '/',
      new ValidationMiddleware([UpdateSocietyDto, 'body']).validate,
      this.societyController.updateProfile,
    );
  }
}
