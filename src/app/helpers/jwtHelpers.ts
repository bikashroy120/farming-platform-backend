import jwt, { SignOptions } from 'jsonwebtoken';

export type JwtPayload = {
  id: string;
  email: string;
  role: string;
};

export const createToken = (
  payload: object,
  secret: string,
  expireTime: string | number,
): string => {
  const options: SignOptions = {
    expiresIn: expireTime as number | `${number}${'s' | 'm' | 'h' | 'd'}`, // Type assertion to satisfy TypeScript
  };

  return jwt.sign(payload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
