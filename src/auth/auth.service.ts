import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Services } from 'src/utility/contants';
import { LoginDto } from './dto';
import { compare } from 'bcrypt';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Services.USER_SERVICE) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(payload: LoginDto) {
    const matchedUser = await this.userService.findUser({
      email: payload.email,
    });

    if (!matchedUser)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    const checkPass = await compare(payload.password, matchedUser.password);
    if (!checkPass)
      throw new HttpException('Wrong password !', HttpStatus.BAD_REQUEST);

    const accessToken = await this.generateAccessToken(
      matchedUser.email,
      matchedUser._id,
      matchedUser.lastname,
      matchedUser.firstname,
    );

    const refreshToken = await this.generateRefreshToken(matchedUser.email);

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(
    email: string,
    _id: Types.ObjectId,
    lastname: string,
    firstname: string,
  ): Promise<string> {
    const access_token = await this.jwtService.signAsync(
      { email, _id, lastname, firstname },
      {
        secret: process.env.ACCESS_TOKEN,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
      },
    );

    return access_token;
  }

  async generateRefreshToken(email: string): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(
      { email },
      {
        secret: process.env.REFRESH_TOKEN,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN,
      },
    );
    return refreshToken;
  }
}
