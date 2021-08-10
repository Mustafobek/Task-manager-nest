import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { UserRepository } from './user.repository';
import { JwtPayload } from './jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.register(authCredentialsDto);
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException(
        `User's credentials were provided wrongly!`,
      );
    }

    const payload: JwtPayload = { username }
    const accessToken = await this.jwtService.sign(payload)

    return { accessToken };
  }
}
