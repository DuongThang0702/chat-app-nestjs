import { genSalt, hash } from 'bcrypt';

export const hashSomthing = async (rawString: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(rawString, salt);
};
