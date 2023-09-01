import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Conversation, Message, User } from 'src/utils/schema';

export class CreateNotifyDto {
  @Expose()
  author: User;
  @Expose()
  @IsNotEmpty()
  content: Message;
  @Expose()
  recipient: User;
  idConversation: Conversation;
}
