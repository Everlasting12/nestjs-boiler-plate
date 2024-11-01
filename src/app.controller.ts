import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/guards/jwt-auth.guard';

@Controller({
  path: '',
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
