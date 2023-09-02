import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Conversation, ConversationDocument } from './conversation.schema';
import { User, UserDocument } from './user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  idConversation: ConversationDocument;

  @Prop()
  content: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
