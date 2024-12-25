import { Request, Response } from 'express';
import { HomeService } from '../services';
import { MethodBinder } from '../utils';

export class HomeController {
  private homeService: HomeService;

  constructor() {
    MethodBinder.bind(this);
    this.homeService = new HomeService();
  }

  async welcome(req: Request, res: Response): Promise<Response> {
    console.log(req.body);
    const result = await this.homeService.welcome(req.body.token);
    return res.send(result);
  }
}
