import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Conversation } from 'src/conversation/conversation.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
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

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' }],
  })
  conversation: Conversation[];
}

export const UserSchema = SchemaFactory.createForClass(User);
