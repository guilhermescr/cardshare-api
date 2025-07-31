import { Request, Response } from 'express';
import { User } from '../models/User';

export class UserController {
  static register(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email) {
      return res.send(400).json({ error: 'E-mail is required!' });
    }

    if (!password) {
      return res.send(400).json({ error: 'Password is required!' });
    }

    return res.send(201).json({
      status: 201,
    });
  }

  static login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email) {
      return res.send(400).json({ error: 'E-mail is required!' });
    }

    if (!password) {
      return res.send(400).json({ error: 'Password is required!' });
    }

    const foundUserByEmail = User.findOne({ email });

    return res.send(200).json({
      status: 200,
      user: foundUserByEmail,
    });
  }
}
