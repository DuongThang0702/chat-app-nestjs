import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Message } from './message.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  _id: Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  lastname: string;

  @Prop()
  firstname: string;

  @Prop()
  avatar: string;

  @Prop({ default: null })
  refresh_token: string;

  @Prop()
  Message: Message[];
}

export const UserSchema = SchemaFactory.createForClass(User);
