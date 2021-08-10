import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./getUser.decorator";
import { User } from "./user.entity";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.register(authCredentialsDto);
  }

  @Post('/login')
  login(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(authCredentialsDto);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: User, @Req() req) {
    console.log(req.user)
    // return user
  };
}
