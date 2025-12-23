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

/**
 * AuthMiddleware provides authentication and authorization utilities for Express routes.
 * 
 * Supports JWT authentication, role-based access control (RBAC), scope-based permissions,
 * and Passport.js strategy integration.
 * 
 * @example
 * ```typescript
 * import { AuthMiddleware } from 'express-pack';
 * 
 * // JWT Authentication
 * router.get('/profile',
 *   AuthMiddleware.authenticateUser({
 *     secret: process.env.JWT_SECRET,
 *     headerKey: 'authorization',
 *     usingBearer: true
 *   }),
 *   getProfile
 * );
 * 
 * // Role-based authorization
 * router.delete('/users/:id',
 *   AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET }),
 *   AuthMiddleware.authorizeRole({ allowedRoles: ['admin'] }),
 *   deleteUser
 * );
 * ```
 * 
 * @category Authentication
 */
export class AuthMiddleware {
  /**
   * Flexible authentication middleware that can handle user auth, role auth, or scope auth.
   * 
   * @param options - Authentication options
   * @param options.userAuth - User authentication configuration
   * @param options.roleAuth - Role authorization configuration
   * @param options.scopeAuth - Scope authorization configuration
   * @returns Express middleware function
   * 
   * @example
   * ```typescript
   * router.get('/admin',
   *   AuthMiddleware.authenticateJWT({
   *     userAuth: { secret: process.env.JWT_SECRET },
   *     roleAuth: { allowedRoles: ['admin'] }
   *   }),
   *   adminHandler
   * );
   * ```
   */
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
   * Returns middleware for authenticating with a Passport.js strategy.
   * 
   * @param strategy - Passport strategy name (e.g., 'google', 'facebook', 'github')
   * @param options - Strategy-specific options
   * @param callback - Optional callback function
   * @returns Passport authentication middleware
   * 
   * @example
   * ```typescript
   * router.get('/auth/google',
   *   AuthMiddleware.authenticatePassport('google', {
   *     scope: ['profile', 'email']
   *   })
   * );
   * 
   * router.get('/auth/google/callback',
   *   AuthMiddleware.authenticatePassport('google', { failureRedirect: '/login' }),
   *   (req, res) => res.redirect('/dashboard')
   * );
   * ```
   */
  static authenticatePassport(
    strategy: string,
    options?: any,
    callback?: (...args: any[]) => any
  ) {
    return passport.authenticate(strategy, options, callback);
  }

  /**
   * Authenticates a user using JWT token from request headers.
   * Verifies the token and optionally fetches user data via callback.
   * 
   * @param options - Authentication options
   * @param options.secret - JWT secret key (defaults to process.env.JWT_SECRET)
   * @param options.headerKey - Header key to extract token from (default: 'authorization')
   * @param options.usingBearer - Whether to expect 'Bearer' prefix (default: true)
   * @param options.callback - Optional async function to fetch user data from decoded token
   * @returns Express middleware function
   * 
   * @throws {401} If authorization token is not found
   * @throws {403} If token is invalid or expired
   * 
   * @example
   * ```typescript
   * import { AuthMiddleware } from 'express-pack';
   * import User from './models/User';
   * 
   * router.get('/protected',
   *   AuthMiddleware.authenticateUser({
   *     secret: process.env.JWT_SECRET,
   *     headerKey: 'authorization',
   *     usingBearer: true,
   *     callback: async (decoded) => {
   *       // Fetch full user object from database
   *       return await User.findById(decoded.userId);
   *     }
   *   }),
   *   (req, res) => {
   *     // req.user is now populated with user data
   *     res.json({ user: req.user });
   *   }
   * );
   * ```
   */
  static authenticateUser(options: AuthenticateUserOptions) {
    return async (
      req: AuthenticatedRequest,
      res: Response,
      next: NextFunction
    ) => {
      const {
        secret = process.env.JWT_SECRET,
        headerKey = "authorization",
        usingBearer = true,
        callback,
      } = options;

      const token = this.extractToken({ req, headerKey, usingBearer });

      if (!token) {
        return res
          .status(401)
          .json({ message: "Authorization token not found" });
      }

      try {
        const jwtSecret = secret || process.env.JWT_SECRET;

        const decoded: any = jwt.verify(token, jwtSecret as string);

        if (callback) {
          const user = await callback(decoded);
          req.user = user ? user : decoded;
        } else {
          req.user = decoded;
        }

        return next();
      } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
    };
  }

  /**
   * Authorizes user based on role(s). Must be used after {@link authenticateUser}.
   * 
   * @param options - Authorization options
   * @param options.allowedRoles - Array of allowed role names
   * @param options.checkAll - If true, user must have ALL roles; if false, user needs at least ONE role (default: true)
   * @returns Express middleware function
   * 
   * @throws {403} If user has no roles or doesn't have required role(s)
   * 
   * @example
   * ```typescript
   * // User must have 'admin' role
   * router.delete('/users/:id',
   *   AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET }),
   *   AuthMiddleware.authorizeRole({ allowedRoles: ['admin'] }),
   *   deleteUser
   * );
   * 
   * // User must have BOTH 'admin' AND 'moderator' roles
   * router.post('/ban-user',
   *   AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET }),
   *   AuthMiddleware.authorizeRole({ 
   *     allowedRoles: ['admin', 'moderator'],
   *     checkAll: true 
   *   }),
   *   banUser
   * );
   * 
   * // User needs at least ONE of: 'admin', 'editor', or 'author'
   * router.post('/posts',
   *   AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET }),
   *   AuthMiddleware.authorizeRole({ 
   *     allowedRoles: ['admin', 'editor', 'author'],
   *     checkAll: false 
   *   }),
   *   createPost
   * );
   * ```
   */
  static authorizeRole({
    allowedRoles = [],
    checkAll = true,
  }: AuthorizeRoleOptions) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      const userRoles: string[] = Array.isArray(req.user?.role)
        ? req.user.role
        : req.user?.role
          ? [req.user.role]
          : [];

      if (!userRoles.length) {
        return res.status(403).json({
          error: "Forbidden",
          message:
            "No role(s) found for the authenticated user. Please ensure your token includes a valid role field.",
        });
      }

      let hasRole = false;
      if (checkAll) {
        // ✅ All allowedRoles must be present in user's roles
        hasRole = allowedRoles.every((role) => userRoles.includes(role));
      } else {
        // ✅ At least one allowedRole must match user's roles
        hasRole = allowedRoles.some((role) => userRoles.includes(role));
      }

      if (hasRole) return next();

      // Identify which roles are missing
      const missingRoles = allowedRoles.filter((r) => !userRoles.includes(r));

      return res.status(403).json({
        error: "Forbidden",
        message: checkAll
          ? `Access denied. Missing required role(s): [${missingRoles.join(
            ", "
          )}] to access this resource.`
          : `Access denied. You need at least one of the following roles: [${allowedRoles.join(
            ", "
          )}]. Found role(s): [${userRoles.join(", ")}].`,
        userRoles,
      });
    };
  }

  /**
   * Authorizes user based on permission scope(s). Must be used after {@link authenticateUser}.
   * 
   * @param options - Authorization options
   * @param options.requiredScopes - Array of required permission scopes
   * @param options.checkAll - If true, user must have ALL scopes; if false, user needs at least ONE scope (default: true)
   * @returns Express middleware function
   * 
   * @throws {403} If user doesn't have required scope(s)
   * 
   * @example
   * ```typescript
   * // User must have 'read:users' scope
   * router.get('/users',
   *   AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET }),
   *   AuthMiddleware.authorizeScope({ 
   *     requiredScopes: ['read:users'] 
   *   }),
   *   getUsers
   * );
   * 
   * // User must have BOTH 'write:posts' AND 'publish:posts' scopes
   * router.post('/posts/publish',
   *   AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET }),
   *   AuthMiddleware.authorizeScope({ 
   *     requiredScopes: ['write:posts', 'publish:posts'],
   *     checkAll: true 
   *   }),
   *   publishPost
   * );
   * 
   * // User needs at least ONE of: 'read:public' or 'read:private'
   * router.get('/documents',
   *   AuthMiddleware.authenticateUser({ secret: process.env.JWT_SECRET }),
   *   AuthMiddleware.authorizeScope({ 
   *     requiredScopes: ['read:public', 'read:private'],
   *     checkAll: false 
   *   }),
   *   getDocuments
   * );
   * ```
   */
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

  /**
   * Extracts JWT token from request headers.
   * 
   * @param options - Token extraction options
   * @param options.req - Express request object
   * @param options.headerKey - Header key to extract token from (default: 'authorization')
   * @param options.usingBearer - Whether to expect 'Bearer' prefix (default: true)
   * @returns Extracted token string or undefined if not found
   * 
   * @example
   * ```typescript
   * // Extract from 'Authorization: Bearer <token>'
   * const token = AuthMiddleware.extractToken({
   *   req,
   *   headerKey: 'authorization',
   *   usingBearer: true
   * });
   * 
   * // Extract from custom header without Bearer prefix
   * const token = AuthMiddleware.extractToken({
   *   req,
   *   headerKey: 'x-api-key',
   *   usingBearer: false
   * });
   * ```
   */
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
