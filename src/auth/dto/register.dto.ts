import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(32)
  @Expose()
  email: string;

  @MaxLength(32)
  @IsNotEmpty()
  password: string;

  @Expose()
  @MaxLength(32)
  @IsNotEmpty()
  lastname: string;

  @Expose()
  @MaxLength(32)
  @IsNotEmpty()
  firstname: string;
}
