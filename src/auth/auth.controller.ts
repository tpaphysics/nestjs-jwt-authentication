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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestBody } from './models/LoginRequestBody';
import { UserToken } from './models/UserToken';
@IsPublicRoute()
@Controller()
@ApiTags('Sigin')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: () => LoginRequestBody })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Provider token for api',
    type: UserToken,
  })
  async login(@Request() req: AuthRequest): Promise<any> {
    return await this.authService.login(req.user);
  }
}
