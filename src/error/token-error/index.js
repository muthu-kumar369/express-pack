export class TokenExpiredError extends Error {
  constructor(message = "Token has expired") {
    super(message);
    this.name = "TokenExpiredError";
  }
}

export class TokenInvalidError extends Error {
  constructor(message = "Token is invalid") {
    super(message);
    this.name = "TokenInvalidError";
  }
}

export class TokenBlacklistedError extends Error {
  constructor(message = "Token has been blacklisted") {
    super(message);
    this.name = "TokenBlacklistedError";
  }
}
