import { IsNotEmpty, IsString } from 'class-validator';

export class createMessage {
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  @IsString()
  IdConversation: string;
}
