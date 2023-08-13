export type ParamFindUser = {
  id?: string;
  email?: string;
};

export type GenerateAccessToken = {
  email: string;
  _id: string;
  lastname: string;
  firstname: string;
};
