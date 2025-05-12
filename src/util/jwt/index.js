import jwt from "jsonwebtoken";
import {
  TokenExpiredError,
  TokenInvalidError,
} from "../../error/token-error/index.js";

export class JWTUtil {
  static async generateTokens({
    tokenPayload = {},
    refreshTokenPayload = {},
    generateRefreshToken = false,
  }) {
    return generateRefreshToken
      ? {
          accessToken: jwt.sign(
            tokenPayload?.payload,
            tokenPayload?.JWT_SECRET || process?.env?.JWT_SECRET,
            {
              expiresIn: tokenPayload?.expiresIn,
            }
          ),
          refreshToken: await this.generateRefreshToken({
            payload: tokenPayload?.payload,
            ...refreshTokenPayload,
          }),
        }
      : jwt.sign(payload, JWT_SECRET || process?.env?.JWT_SECRET, {
          expiresIn,
        });
  }

  // Refresh Token (long-lived)
  static async generateRefreshToken({
    payload,
    REFRESH_SECRET = "",
    expiresIn = "7d",
  }) {
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn });
    return refreshToken;
  }

  static async verify({ token, JWT_SECRET = "" }) {
    try {
      return jwt.verify(token, JWT_SECRET || process?.env?.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") throw new TokenExpiredError();
      if (err.name === "JsonWebTokenError") throw new TokenInvalidError();
      throw err;
    }
  }

  static decode({ token }) {
    return jwt.decode(token); // No error thrown even if token is invalid
  }

  static async verifyRefreshToken({ token, REFRESH_SECRET = "" }) {
    try {
      const payload = jwt.verify(token, REFRESH_SECRET);
      return payload;
    } catch (err) {
      throw new TokenInvalidError("Refresh token is invalid");
    }
  }

  // Generate New Access Token using Refresh Token
  static async refreshAccessToken({ token, REFRESH_SECRET, JWT_SECRET }) {
    const payload = await this.verifyRefreshToken({ token, REFRESH_SECRET });

    // if refresh token is valid then generate new token
    return payload
      ? this.generateTokens({
          tokenPayload: {
            payload,
            JWT_SECRET,
            expiresIn: process?.env?.ACCESS_TOKEN_EXPIRE_TIME || "25m",
          },
        })
      : null;
  }
}
