import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: string;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  idConversation: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
