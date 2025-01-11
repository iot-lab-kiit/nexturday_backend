import { NextFunction, Request, Response } from 'express';
import { MethodBinder } from '../../utils';
import { plainToInstance } from 'class-transformer';
import { LoginService, SignupService } from '../../services/auth';
import { loginDto, signupDto } from '../../common/dtos/login';

export class AuthController {
  private loginService: LoginService;
  private signupService: SignupService;

  constructor() {
    MethodBinder.bind(this);
    this.loginService = new LoginService();
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(loginDto, {
        ...req.body,
      });
      const result = await this.loginService.checkLogin(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(signupDto, {
        ...req.body,
      });
      const result = await this.signupService.societySignup(dto);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}
