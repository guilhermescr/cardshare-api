import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      const user = await UserService.register(username, email, password);
      return res.status(200).json({ status: 201, user });
    } catch (error: any) {
      const message = error.message || 'Internal server error.';
      let status = 500;

      if (message.includes('required')) status = 400;
      else if (message.includes('already in use')) status = 409;

      return res.status(status).json({ error: message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;
      const user = await UserService.login(identifier, password);
      return res.status(200).json({ status: 200, user });
    } catch (error: any) {
      const message = error.message || 'Internal server error.';
      let status = 500;

      if (message.includes('required')) status = 400;
      else if (message.includes('no user')) status = 404;
      else if (message.includes('Invalid password')) status = 401;

      return res.status(status).json({ error: message });
    }
  }
}
