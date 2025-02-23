import { NextFunction, Request, Response } from 'express';
import { TeamService } from '../../../services/event/participant';
import { MethodBinder } from '../../../utils';
import { plainToInstance } from 'class-transformer';
import { IUser } from '../../../interfaces/express/user.interface';
import { SearchDto } from '../../../common/dtos';

export class TeamController {
  private teamService: TeamService;

  constructor() {
    MethodBinder.bind(this);
    this.teamService = new TeamService();
  }

  // async joinEvent(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> {
  //   try {
  //     const participantId = (req.user as IUser).sub;
  //     const eventId = req.params.id;
  //     const result = await this.participantService.joinEvent(
  //       participantId,
  //       eventId,
  //     );
  //     res.status(201).json(result);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async getAllJoinedEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const participantId = (req.user as IUser).sub;
      const dto = plainToInstance(SearchDto, req.query);
      const result = await this.teamService.getAllJoinedEvents(
        participantId,
        dto,
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async createTeam(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const participantId = (req.user as IUser).sub;
      const eventId = req.params.id;
      const teamName: string = req.body.teamName;
      if (!teamName) {
        throw new Error('team name is required');
      }
      const result = await this.teamService.createTeam(participantId, eventId, teamName);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async joinTeam(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const participantId = (req.user as IUser).sub;
      const teamId = req.params.id;
      const result = await this.teamService.joinTeam(participantId, teamId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTeamId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const eventId = req.params.id;
      const participantId = (req.user as IUser).sub;
      const result = await this.teamService.getTeamId(participantId, eventId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getTeamDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const teamId = req.params.id;
      const result = await this.teamService.getTeamDetails(teamId);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
