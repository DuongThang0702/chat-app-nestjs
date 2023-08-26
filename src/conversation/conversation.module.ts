import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from '../utils/schema/';
import { Services } from 'src/utils/contants';
import { UserModule } from 'src/user/user.module';
import { MessageModule } from 'src/message/message.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    MessageModule,
    UserModule,
  ],
  providers: [
    { provide: Services.CONVERSATION_SERVICE, useClass: ConversationService },
  ],
  controllers: [ConversationController],
})
export class ConversationModule {}
