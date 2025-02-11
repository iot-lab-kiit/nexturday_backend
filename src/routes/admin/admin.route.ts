import { Router } from 'express';
import { ValidationMiddleware } from '../../middlewares';
import { EventSearchDto } from '../../common/dtos';
import { AdminController } from '../../controllers/admin';

export class AdminRoute {
  public router: Router;
  private adminController: AdminController;

  constructor() {
    this.router = Router();
    this.adminController = new AdminController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      '/events',
      new ValidationMiddleware([EventSearchDto, 'query']).validate,
      this.adminController.getAllEvents,
    );
    this.router.patch('/event/reject/:id', this.adminController.rejectEvent);
    this.router.patch('/event/approve/:id', this.adminController.approveEvent);
  }
}
