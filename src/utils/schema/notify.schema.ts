import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from './user.schema';
import { ConversationDocument } from './conversation.schema';

export type NotifyDocument = HydratedDocument<Notify>;

@Schema({ timestamps: true })
export class Notify {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: UserDocument;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  recipient: UserDocument;

  @Prop()
  content: string;

  @Prop({ default: 'false' })
  isChecked: boolean;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  })
  idConversation: ConversationDocument;
}

export const NotifySchema = SchemaFactory.createForClass(Notify);
