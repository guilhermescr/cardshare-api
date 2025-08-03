import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { ClassValidator } from '../utils/ClassValidator';

export class AuthController {
  static async register({ body }: Request, res: Response, next: NextFunction) {
    try {
      const registerDto = await ClassValidator.validate(RegisterDto, body);
      const user = await AuthService.register(registerDto);
      return res.status(200).json({ status: 201, user });
    } catch (error: any) {
      next(error);
    }
  }

  static async login({ body }: Request, res: Response, next: NextFunction) {
    try {
      const loginDto = await ClassValidator.validate(LoginDto, body);
      const user = await AuthService.login(loginDto);
      return res.status(200).json({ status: 200, user });
    } catch (error: any) {
      next(error);
    }
  }
}
