import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
  Message,
  MessageSchema,
} from 'src/utils/schema';
import { Services } from 'src/utils/contants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [{ provide: Services.MESSAGE_SERVICE, useClass: MessageService }],
})
export class MessageModule {}
