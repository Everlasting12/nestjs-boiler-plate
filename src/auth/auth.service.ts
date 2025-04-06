import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { compare, genSalt, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from '../../libs/common/logger/logger.service';
import { CheckAuthorizationDto } from './dto/check-authorization.dto';
import { UserRolesService } from 'src/access-management/user-roles/user-roles.service';
import { PermissionsService } from 'src/access-management/permissions/permissions.service';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'libs/common/environment-variable';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private userRoleService: UserRolesService,
    private permissionsService: PermissionsService,
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  private readonly logger = new LoggerService();

  async validateUser(loginDto: LoginDto): Promise<any> {
    const user = await this.usersService.findOne({
      email: loginDto.email,
      isActive: true,
    });

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

    const role = await this.userRoleService.findAll({
      userId: [user.userId],
      relation: true,
    });

    if (role?.data?.length) {
      const {
        permissionEntities,
        roleId,
        role: { permissionIds },
      } = role.data.at(0);
      const { data } = await this.permissionsService.findAll({
        paginate: false,
        isActive: true,
        name: permissionIds ?? [],
      });

      let { apiScopes, feScopes } = data?.reduce(
        (acc, item) => {
          acc.apiScopes = acc.apiScopes.concat(item.apiScopes);
          acc.feScopes = acc.feScopes.concat(item.feScopes);
          return acc;
        },
        { apiScopes: [], feScopes: [] },
      );

      if (permissionEntities && Object.keys(permissionEntities).length > 0) {
        const replaceScopes = (
          scopes: string[],
          key: string,
          values: string[],
        ): string[] => {
          const result = new Set<string>(); // Use a Set to handle duplicates
          for (const scope of scopes) {
            for (const val of values) {
              result.add(scope.replace(`{{${key}}}`, val));
            }
          }
          return Array.from(result); // Convert Set back to an array
        };

        for (const [key, values] of Object.entries(permissionEntities)) {
          apiScopes = replaceScopes(apiScopes, key, values);
          feScopes = replaceScopes(feScopes, key, values); // Deduplication happens here
        }
      }

      payload['apiScopes'] = apiScopes;
      payload['feScopes'] = feScopes;
      payload['roleId'] = roleId;
      payload['permissionEntities'] = permissionEntities;
    }

    return {
      authentication: {
        accessToken: await this.jwtService.signAsync(payload),
        payload,
      },
      user,
    };
  }

  async checkAuthorization(
    body: CheckAuthorizationDto,
    scopes?: string[],
  ): Promise<boolean> {
    const { httpMethod, originalUrl, token } = body;

    if (!token) return false;

    // TODO: if scopes not provided then verify jwt token and take scopes from payload // sin:: not doing it bcoz its going to take my time rn ;)

    for (const aScope of scopes) {
      const scopeMethod = aScope.split('::')[0];
      let scopeEndPoint = aScope
        .split('::')[1]
        .replaceAll(/\/\*\//g, '/[^/]+/');

      if ('ALL' == scopeMethod || scopeMethod == httpMethod) {
        scopeEndPoint = scopeEndPoint
          .replaceAll('?', '\\?')
          .replaceAll('permissionEntity.', 'permissionEntity\\.');

        const regex = new RegExp(scopeEndPoint);
        const isMatched = regex.test(originalUrl);

        this.logger.debug(
          `originalUrl:${originalUrl} | regex:${regex} | scopeMethod:${scopeMethod} ===>>> isMatched :${isMatched}`,
        );
        this.logger.debug(
          '=========================================================================',
        );

        if (!isMatched) continue;
        return true;
      }
    }

    return false;
  }

  async changePassword(user: any, body: ChangePasswordDto) {
    try {
      const { oldPassword, newPassword } = body;

      const existingUser = await this.usersService.findByUserId(user.userId!);
      if (!existingUser) {
        throw new UnauthorizedException('User not found');
      }

      const isOldPasswordValid = await compare(
        oldPassword,
        existingUser.password,
      );
      if (!isOldPasswordValid) {
        throw new UnauthorizedException('Old password is incorrect');
      }

      const salt = await genSalt(+this.configService.get('SALT'));

      const hashedNewPassword = await hash(newPassword, salt);

      await this.usersService.updatePassword(
        existingUser.userId,
        hashedNewPassword,
      );

      return { message: 'Password successfully changed' };
    } catch (error) {
      this.logger.error('AuthService ~ changePassword ~ changePassword', error);
      throw new UnauthorizedException('Something went wrong');
    }
  }
}
