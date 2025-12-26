import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface AuthMiddlewareOptions {
  userAuth?: AuthenticateUserOptions;
  roleAuth?: AuthorizeRoleOptions;
  scopeAuth?: AuthorizeScopeOptions;
}

export interface AuthenticateUserOptions {
  secret?: string;
  headerKey?: string;
  usingBearer?: boolean;
  callback?: any;
}

export interface AuthorizeRoleOptions {
  allowedRoles?: string[];
  checkAll?: boolean; // currently unused, but kept for future extension
}

export interface AuthorizeScopeOptions {
  requiredScopes?: string[];
  checkAll?: boolean;
}

export interface AuthenticatedRequest extends Request {
  req: Request;
  user?: JwtPayload | string | any;
}
