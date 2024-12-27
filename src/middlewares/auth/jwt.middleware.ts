import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import { IJwtUser } from '../../interfaces/express/user.interface';
import { CustomError, MethodBinder } from '../../utils';

export class JWTMiddleware {
  constructor() {
    MethodBinder.bind(this);
  }

  verify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new CustomError('Authorization token is required', 401);
    }

    const token = req.headers.authorization?.split(' ')[1] as string;
    try {
      const user = verify(token, process.env.JWT_SECRET as string) as IJwtUser;

      req.user = {
        email: user.email,
        name: user.name,
        sub: user.sub,
        image: user?.image,
      } as IJwtUser;
      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          message: 'invalid token',
        });
      }
      res.status(500).json({
        success: false,
        message: 'internal server error',
      });
    }
  }
}
