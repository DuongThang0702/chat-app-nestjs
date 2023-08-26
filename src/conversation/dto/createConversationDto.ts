import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
  @IsNotEmpty()
  @Expose()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Expose()
  message: string;
}
