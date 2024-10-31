import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { compare } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../libs/common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new LoggerService();

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOne({ email: loginDto.email });

    if (user && (await compare(loginDto.password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, id, ...result } = user;
      return result;
    }
    return null;
  }

  async signUp(body: RegisterDto) {
    this.logger.debug('AuthService ~ signUp ~ body:', body);
    return await this.usersService.createUser(body);
  }

  async signIn(user: any) {
    this.logger.debug('AuthService ~ signIn ~ user:', user);
    const payload = { email: user.email, sub: user.userId };
    return {
      authentication: {
        accessToken: await this.jwtService.signAsync(payload),
        payload,
      },
      user,
    };
  }
}
