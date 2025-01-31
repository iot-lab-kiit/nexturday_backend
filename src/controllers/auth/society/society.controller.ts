import { NextFunction, Request, Response } from 'express';
import { MethodBinder } from '../../../utils';
import { plainToInstance } from 'class-transformer';
import { SocietyService } from '../../../services/auth/society';
import { LoginDto, SignupDto } from '../../../common/dtos/auth/society';

export class SocietyController {
  private societyService: SocietyService;

  constructor() {
    MethodBinder.bind(this);
    this.societyService = new SocietyService();
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(LoginDto, req.body);
      let result = await this.societyService.login(dto);
      // result = {...result, data: {...result.data, accessToken: ""}};
      res.cookie('token', result.data?.accessToken).status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(SignupDto, req.body);
      const result = await this.societyService.signup(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
