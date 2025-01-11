import { NextFunction, Request, Response } from 'express';
import { VerifyTokenService } from '../../../services/auth/participant';
import { CustomError, MethodBinder } from '../../../utils';
import { FirebaseAuthError } from 'firebase-admin/auth';

export class VerifyTokenController {
  private verifyTokenService: VerifyTokenService;

  constructor() {
    MethodBinder.bind(this);
    this.verifyTokenService = new VerifyTokenService();
  }

  async verifyToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new CustomError('Authorization token is required', 401);
      }
      const token = req.headers.authorization?.split(' ')[1] as string;
      const result = await this.verifyTokenService.verifyToken(token);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        res.status(401).json({
          success: false,
          message: 'Token validation failed',
        });
      } else {
        next(error);
      }
    }
  }
}
