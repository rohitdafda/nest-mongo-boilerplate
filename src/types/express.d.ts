import { AuthenticatedUser, RoleTypesE } from './index';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser<RoleTypesE>;
    }
  }
}

export {};
