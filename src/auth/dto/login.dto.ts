import { IsEmail, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  accessToken: string;

  refreshToken: string;
}
