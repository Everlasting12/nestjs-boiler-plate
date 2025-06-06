import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { hash, genSalt } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { EnvironmentVariables } from '../../libs/common/environment-variable';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}
  async findAll(query: Prisma.UserWhereUniqueInput) {
    return await this.usersRepository.findAll(query);
  }
  async findOne(query: Prisma.UserWhereUniqueInput) {
    return await this.usersRepository.findOne(query);
  }
  async findByUserId(userId: string) {
    const user = await this.usersRepository.findOne({ userId, isActive: true });
    if (!user) {
      throw new BadRequestException('Incorrect userId provided');
    }
    return user;
  }

  async createUser(body: CreateUserDto) {
    const user = await this.findOne({ email: body.email, isActive: true });
    if (user) {
      throw new ConflictException('User with email already exists');
    }
    body.email = body.email.trim().toLowerCase();
    const salt = await genSalt(+this.configService.get('SALT'));
    body.password = await hash(body.password, salt);
    return await this.usersRepository.createUser(body);
  }

  async updatePassword(userId: string, hashedNewPassword: string) {
    return await this.usersRepository.updatePassword(userId, hashedNewPassword);
  }
  async updateByUserId(userId: string, body: UpdateUserDto) {
    if (body?.email) {
      const user = await this.findOne({ email: body.email });
      if (user) {
        throw new ConflictException('User with email already exists');
      }
    }

    return await this.usersRepository.updateOne({ userId }, body);
  }
}
