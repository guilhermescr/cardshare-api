import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { ClassValidator } from '../utils/ClassValidator';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async register({ body }: Request, res: Response, next: NextFunction) {
    try {
      const registerDto = await ClassValidator.validate(RegisterDto, body);
      const user = await this.authService.register(registerDto);
      return res.status(201).json({ user });
    } catch (error: any) {
      next(error);
    }
  }

  async confirmEmail({ query }: Request, res: Response, next: NextFunction) {
    try {
      const token = query.token as string;
      await this.authService.confirmEmail(token);
      return res.status(200).send(`
      <html>
        <head>
          <title>Email Confirmed</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f9f9f9; }
            .container { max-width: 400px; margin: 60px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 32px; text-align: center; }
            h2 { color: #2d7ff9; }
            p { color: #444; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Email Confirmed!</h2>
            <p>Your email has been successfully confirmed.<br>You can now log in to your account.</p>
          </div>
        </body>
      </html>
    `);
    } catch (error: any) {
      next(error);
    }
  }

  async login({ body }: Request, res: Response, next: NextFunction) {
    try {
      const loginDto = await ClassValidator.validate(LoginDto, body);
      const result = await this.authService.login(loginDto);
      return res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }
}
