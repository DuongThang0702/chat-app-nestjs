import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Message } from './message.schema';
import { User } from './user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  recipient: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  message: Message[];

  @Prop()
  lastMessage: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
