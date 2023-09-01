import { Expose } from 'class-transformer';
import { User } from 'src/utils/schema';

export class NotifyMessage {
  @Expose()
  author: User;
  @Expose()
  content: string;
  @Expose()
  createdAt: string;
  idConversation: string;
  _id: string;
}
