import { Types } from 'mongoose';

export type User = {
  email: string;
  lastname: string;
  firstname: string;
  _id: Types.ObjectId;
};
