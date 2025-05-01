import { IUser } from '@one-cart/models';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
