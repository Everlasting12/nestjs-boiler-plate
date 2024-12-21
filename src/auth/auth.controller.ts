import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './guards/jwt-auth.guard';
import { CheckAuthorizationDto } from './dto/check-authorization.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Req() req: Request) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() body: RegisterDto) {
    return await this.authService.signUp(body);
  }

  @Public()
  @Post('check-authorization')
  async checkAuthorization(
    @Body() body: CheckAuthorizationDto,
  ): Promise<boolean> {
    return await this.authService.checkAuthorization(body, []);
  }
}
