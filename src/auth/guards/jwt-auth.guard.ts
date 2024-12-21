import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { jwtConstants } from '../constants';
import { AuthService } from '../auth.service';
import { CheckAuthorizationDto } from '../dto/check-authorization.dto';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Please provide a access token');
    }

    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    const [isValidUser] = await Promise.all([
      await this.usersService.findOne({ userId: payload.sub }),
    ]);

    if (!isValidUser) {
      console.log('JwtAuthGuard ~ canActivate ~ isValidUser:', isValidUser);
      throw new UnauthorizedException('Invalid or expired token');
    }

    const dto = new CheckAuthorizationDto();
    dto.host = request.host;
    dto.httpMethod = request.method;
    dto.originalUrl = request.url;
    dto.protocol = request.protocol;
    dto.token = token;

    const isMatched = await this.authService.checkAuthorization(
      dto,
      payload.apiScopes,
    );

    if (!isMatched) {
      throw new ForbiddenException("You don't have access to this resource");
    }

    request['userId'] = payload.sub;
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
