import { Controller, Inject, Body, Post, Res } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Routes, Services } from 'src/utility/contants';
import { LoginDto, RegisterDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.USER_SERVICE) private userService: UserService,
    @Inject(Services.AUTH_SERVICES) private authService: AuthService,
    private jwtService: JwtService,
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
  async login(@Body() payload: LoginDto, @Res() res: Response) {
    const response = await this.authService.login(payload);
    res.cookie('refreshToken', response.refreshToken);
    res.status(200).json({ accessToken: response.accessToken });
  }
}
