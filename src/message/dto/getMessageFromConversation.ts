import { IsNotEmpty, IsString } from 'class-validator';

export class ParamGetMessageFromConversation {
  @IsNotEmpty()
  @IsString()
  idConversation: string;
}
