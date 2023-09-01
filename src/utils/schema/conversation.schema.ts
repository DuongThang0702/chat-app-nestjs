import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Message } from './message.schema';
import { UserDocument } from './user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  recipient: UserDocument;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  message: Message[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  lastMessage: Message;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
