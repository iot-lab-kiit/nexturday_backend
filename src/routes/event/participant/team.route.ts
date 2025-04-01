import { Router } from 'express';
import { TeamController } from '../../../controllers/event/participant';
import { MethodBinder } from '../../../utils';
import { ValidationMiddleware } from '../../../middlewares';
import { SearchDto } from '../../../common/dtos';
import { FavoriteRoute } from './favorite.route';
import { TeamAuthMiddleware } from '../../../middlewares/auth/event/participant';

export class ParticipantRoute {
  public router: Router;
  private teamController: TeamController;
  private favoriteRoute: FavoriteRoute;
  private TeamAuthMiddleware: TeamAuthMiddleware;

  constructor() {
    MethodBinder.bind(this);
    this.router = Router();
    this.teamController = new TeamController();
    this.favoriteRoute = new FavoriteRoute();
    this.TeamAuthMiddleware = new TeamAuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use('/favorite', this.favoriteRoute.router);
    // this.router.post('/:id', this.participantController.joinEvent);
    this.router.get(
      '/',
      new ValidationMiddleware([SearchDto, 'query']).validate,
      this.teamController.getAllJoinedEvents,
    );
    this.router.post('/team/create/:id', this.teamController.createTeam);
    this.router.post(
      '/team/updateName/:teamId',
      this.teamController.updateTeamName,
    );
    this.router.post(
      '/team/updatePayment/:teamId',
      this.teamController.updatePaymentId,
    );

    this.router.post('/team/join/:id', this.teamController.joinTeam);
    this.router.post('/team/leave/:teamId', this.teamController.leaveTeam);
    this.router.get(
      '/team/:id',
      this.TeamAuthMiddleware.verify,
      this.teamController.getTeamDetails,
    );
    this.router.get(
      '/team/paymentStatus/:teamId',
      this.TeamAuthMiddleware.verify,
      this.teamController.getPaymentStatus,
    );
    this.router.get('/teamId/:id', this.teamController.getTeamId);
  }
}
