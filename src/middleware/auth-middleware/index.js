import jwt from "jsonwebtoken";

export class AuthMiddlewareHandler {
  static AuthMiddleware({ userAuth = {}, roleAuth = {}, scopeAuth = {} }) {
    if (userAuth && Object.keys(userAuth)?.length) {
      this.authenticateUser({ ...userAuth });
    }

    if (roleAuth && Object.keys(roleAuth)?.length) {
      this.authorizeRole({ ...roleAuth });
    }

    if (scopeAuth && Object.keys(scopeAuth)?.length) {
      this.authorizeScope({ ...scopeAuth });
    }
  }

  static authenticateUser({ secret, headerKey, usingBearer }) {
    return (req, res, next) => {
      // extract token from header
      const token = this.extractToken({ req, headerKey, usingBearer });

      if (!token)
        return res
          .status(401)
          .json({ message: "Authorization token not found" });

      try {
        const decoded = jwt.verify(token, secret || process.env.JWT_SECRET);

        req.user = decoded; // ✅ Attach user info to the request
        next();
      } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
    };
  }

  static authorizeRole({ allowedRoles = [], checkAll = true }) {
    return (req, res, next) => {
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

  static authorizeScope({ requiredScopes = [], checkAll = true }) {
    return (req, res, next) => {
      const userScopes = req.user?.scopes || [];
      let haveScope = false;

      if (checkAll) {
        haveScope = requiredScopes.every((scope) =>
          requiredScopes?.includes(scope)
        );
      } else {
        haveScope = requiredScopes.some((scope) =>
          requiredScopes?.includes(scope)
        );
      }

      if (haveScope) {
        next();
      }

      const missingScopes = requiredScopes.filter(
        (scope) => !userScopes.includes(scope)
      );

      if (missingScopes.length > 0) {
        return res.status(403).json({
          error: "Forbidden",
          message: `Insufficient permissions. Missing required scope(s): [${missingScopes.join(
            ", "
          )}].`,
          userScopes,
        });
      }

      next();
    };
  }

  static extractToken({
    req,
    headerKey = "authorization",
    usingBearer = true,
  }) {
    return usingBearer
      ? req.headers[headerKey]?.split(" ")[1]
      : req.headers[headerKey];
  }
}
