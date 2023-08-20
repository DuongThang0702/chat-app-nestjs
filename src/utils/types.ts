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
