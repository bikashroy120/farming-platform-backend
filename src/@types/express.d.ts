import { JwtPayload } from '../app/helpers/jwtHelpers';

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null;
    }
  }
}
