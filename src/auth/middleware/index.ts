import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  AuthenticatedRequest,
  AuthenticateUserOptions,
  AuthMiddlewareOptions,
  AuthorizeRoleOptions,
  AuthorizeScopeOptions,
} from "../types/middleware/auth.middleware.types";
import passport from "passport";

export class AuthMiddleware {
  static authenticateJWT({
    userAuth = {},
    roleAuth = {},
    scopeAuth = {},
  }: AuthMiddlewareOptions) {
    if (userAuth && Object.keys(userAuth).length) {
      return this.authenticateUser(userAuth);
    }

    if (roleAuth && Object.keys(roleAuth).length) {
      return this.authorizeRole(roleAuth);
    }

    if (scopeAuth && Object.keys(scopeAuth).length) {
      return this.authorizeScope(scopeAuth);
    }

    // Default middleware if nothing is provided
    return (req: Request, res: Response, next: NextFunction) => next();
  }
  /**
   * Returns middleware for authenticating with a specific strategy
   */
  static authenticatePassport(
    strategy: string,
    options?: any,
    callback?: (...args: any[]) => any
  ) {
    return passport.authenticate(strategy, options, callback);
  }

  static authenticateUser({
    secret,
    headerKey = "authorization",
    usingBearer = true,
  }: AuthenticateUserOptions) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const token = this.extractToken({ req, headerKey, usingBearer });

      if (!token) {
        return res
          .status(401)
          .json({ message: "Authorization token not found" });
      }

      try {
        const decoded = jwt.verify(token, secret || process.env.JWT_SECRET!);

        req.user = decoded;
        next();
      } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
    };
  }

  static authorizeRole({
    allowedRoles = [],
    checkAll = true,
  }: AuthorizeRoleOptions) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(403).json({
          status: "forbidden",
          message:
            "No role found for the authenticated user. Please ensure your token includes a role.",
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          status: "forbidden",
          message: `Access denied. Required role(s): [${allowedRoles.join(
            ", "
          )}], but found: ${userRole}.`,
        });
      }

      next();
    };
  }

  static authorizeScope({
    requiredScopes = [],
    checkAll = true,
  }: AuthorizeScopeOptions) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userScopes: string[] = req.user?.scopes || [];

      let haveScope = false;
      if (checkAll) {
        // All requiredScopes must be included in userScopes
        haveScope = requiredScopes.every((scope) => userScopes.includes(scope));
      } else {
        // At least one requiredScope must be included in userScopes
        haveScope = requiredScopes.some((scope) => userScopes.includes(scope));
      }

      if (haveScope) {
        return next();
      }

      const missingScopes = requiredScopes.filter(
        (scope) => !userScopes.includes(scope)
      );

      return res.status(403).json({
        error: "Forbidden",
        message: `Insufficient permissions. Missing required scope(s): [${missingScopes.join(
          ", "
        )}].`,
        userScopes,
      });
    };
  }

  static extractToken({
    req,
    headerKey = "authorization",
    usingBearer = true,
  }: {
    req: Request;
    headerKey?: string;
    usingBearer?: boolean;
  }): string | undefined {
    const headerValue = req.headers[headerKey.toLowerCase()] as
      | string
      | undefined;

    if (!headerValue) return undefined;

    return usingBearer ? headerValue.split(" ")[1] : headerValue;
  }
}
