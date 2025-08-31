import {
  Route,
  Post,
  Get,
  Body,
  Query,
  SuccessResponse,
  Response,
  Tags,
  Controller,
} from 'tsoa';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dtos/auth.dto';
import { ClassValidator } from '../utils/ClassValidator';

@Route('auth')
@Tags('Authentication')
export class AuthController extends Controller {
  private authService = new AuthService();

  @SuccessResponse(201, 'User registered successfully')
  @Response(400, 'Validation error')
  @Post('register')
  public async register(@Body() body: RegisterDto): Promise<{ user: any }> {
    const registerDto = await ClassValidator.validate(RegisterDto, body);
    const user = await this.authService.register(registerDto);
    this.setStatus(201);
    return { user };
  }

  @Get('confirm-email')
  public async confirmEmail(@Query() token: string): Promise<string> {
    await this.authService.confirmEmail(token);
    return `
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
    `;
  }

  @Post('login')
  public async login(@Body() body: LoginDto): Promise<any> {
    const loginDto = await ClassValidator.validate(LoginDto, body);
    return await this.authService.login(loginDto);
  }
}
