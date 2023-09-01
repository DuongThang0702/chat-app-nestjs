import { User } from './schema';

export type AuthenticatedDecode = {
  _id: string;
  email: string;
  lastname: string;
  firstname: string;
};

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedDecode;
}

export type PayloadCreateMessage = {
  content: string;
  IdConversation: string;
};

export type MessageT = {
  content: string;
  author: User;
  _id: string;
  createdAt: string;
  updatedAt: string;
  idConversation: string;
};

export interface QueryParamsNotify {
  limit: number;
  sort: {};
}
