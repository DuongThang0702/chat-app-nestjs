import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationSchema,
  Message,
  MessageSchema,
  Notify,
  NotifySchema,
} from 'src/utils/schema';
import { Services } from 'src/utils/contants';
import { NotifyModule } from 'src/notify/notify.module';

@Module({
  imports: [
    NotifyModule,
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: Notify.name, schema: NotifySchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [{ provide: Services.MESSAGE_SERVICE, useClass: MessageService }],
  exports: [{ provide: Services.MESSAGE_SERVICE, useClass: MessageService }],
})
export class MessageModule {}
