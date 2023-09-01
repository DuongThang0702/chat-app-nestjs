import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type NotifyDocument = HydratedDocument<Notify>;

@Schema({ timestamps: true })
export class Notify {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  recipient: User;

  @Prop()
  content: string;
}

export const NotifySchema = SchemaFactory.createForClass(Notify);
