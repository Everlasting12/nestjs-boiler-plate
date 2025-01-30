import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { hash, genSalt } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../../libs/common/environment-variable';
import { UserQueryDto } from './dto/get-user-query.dto';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly configurationService: ConfigurationsService,
  ) {}
  async findAll(query: UserQueryDto) {
    const { unassingedUsers, ...restQuery } = query;
    const users = await this.usersRepository.findAll(restQuery);
    if (unassingedUsers) {
      if (users.total) {
        users.data = users.data.filter((u) => !u?.userRole?.length);
        users.total = users.data.length;
      }
    }
    return users;
  }
  async findOne(query: UserQueryDto) {
    return await this.usersRepository.findOne(query);
  }
  async findByUserId(userId: string) {
    const user = await this.usersRepository.findOne({
      userIds: [userId],
      isActive: true,
    });
    if (!user) {
      throw new BadRequestException('Incorrect userId provided');
    }
    return user;
  }

  async createUser(body: CreateUserDto, createdById?: string) {
    const totalUsers = await this.getTotalUserCount();

    const maxAllowedUsers = (await this.configurationService.findOne(
      'MAX_USERS_COUNT',
    )) as unknown as { value: number };

    if (totalUsers >= maxAllowedUsers.value) {
      throw new BadRequestException(
        `Maximum users (${maxAllowedUsers.value}) limit reached for the system`,
      );
    }

    const user = await this.findOne({ email: body.email, isActive: true });
    if (user) {
      throw new ConflictException('User with email already exists');
    }
    body.email = body.email.trim().toLowerCase();
    const salt = await genSalt(+this.configService.get('SALT'));
    body.password = await hash(body.password, salt);

    return await this.usersRepository.createUser({
      ...body,
      ...(createdById && {
        createdBy: {
          connect: { userId: createdById }, // Link the creator using createdBy
        },
      }),
    });
  }

  async getTotalUserCount() {
    return await this.usersRepository.getTotalUserCount();
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
