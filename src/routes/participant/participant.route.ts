import { Router } from 'express';
import { ParticipantController } from '../../controllers';
import { ValidationMiddleware } from '../../middlewares';
import { UpdateParticipantDetailDto } from '../../common/dtos';

export class ParticipantRoute {
  public router: Router;
  private participantController: ParticipantController;

  constructor() {
    this.router = Router();
    this.participantController = new ParticipantController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.participantController.getProfile);
    this.router.patch(
      '/',
      new ValidationMiddleware([UpdateParticipantDetailDto, 'body']).validate,
      this.participantController.updateProfile,
    );
  }
}
