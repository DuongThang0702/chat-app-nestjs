import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Message } from 'src/message/message.schema';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema({ timestamps: true })
export class Conversation {
  @Prop()
  creator: string;

  @Prop()
  recipient: number;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  message: Message[];

  @Prop()
  lastMessage: string;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
