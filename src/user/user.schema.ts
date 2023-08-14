import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
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
}

export const UserSchema = SchemaFactory.createForClass(User);
