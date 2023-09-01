import { Exclude, Expose } from 'class-transformer';
import { Types } from 'mongoose';

export class CurrentDto {
  @Expose()
  _id: Types.ObjectId;
  @Expose()
  lastname: string;
  @Expose()
  firstname: string;
  @Expose()
  email: string;
  @Expose()
  avatar: string;
  @Expose()
  refresh_token: string;
  @Exclude()
  password: string;
}
