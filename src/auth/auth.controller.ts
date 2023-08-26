import {
  Controller,
  Inject,
  Body,
  Post,
  Res,
  Get,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Routes, Services } from 'src/utils/contants';
import { CurrentDto, LoginDto, RegisterDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthenticatedRequest } from 'src/utils/types';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.USER_SERVICE) private userService: UserService,
    @Inject(Services.AUTH_SERVICES) private authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterDto) {
    return plainToInstance(
      RegisterDto,
      await this.userService.createUser(payload),
      { excludeExtraneousValues: true },
    );
  }

  @Post('login')
  async login(@Body() payload: LoginDto, @Res() res) {
    const response = await this.authService.login(payload);
    res.cookie('refreshToken', response.refreshToken);
    res.status(200).json({ accessToken: response.accessToken });
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-token')
  async refreshToken(@Req() req) {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken)
      throw new HttpException('invalid cookie', HttpStatus.UNAUTHORIZED);
    return await this.authService.refreshToken(req.user, cookie.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  async current(@Req() req: AuthenticatedRequest) {
    if (!req.user)
      throw new HttpException('invalid cookie', HttpStatus.UNAUTHORIZED);
    const findUser = await this.userService.findUser({ email: req.user.email });
    return plainToInstance(CurrentDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logOut(@Req() req, @Res() res) {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken)
      throw new HttpException('No token on cookie', HttpStatus.UNAUTHORIZED);
    const response = await this.authService.logOut(
      req.user,
      cookie.refreshToken,
    );
    if (!response)
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'logout success!' });
  }
}
