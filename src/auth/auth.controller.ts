import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest } from './models/AuthRequest';
import { LocalAuthGuard } from './gards/local-auth.guard';
import { IsPublicRoute } from './decorators/is-public-route.decorator';
@IsPublicRoute()
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest): Promise<any> {
    return await this.authService.login(req.user);
  }
}
