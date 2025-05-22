import jwt, { SignOptions } from "jsonwebtoken";
import {
  TokenExpiredError,
  TokenInvalidError,
} from "../../../common/error/token-error/index.js";

import { StringValue } from "ms";
import {
  GenerateTokensParams,
  RefreshTokenPayload,
  VerifyParams,
  DecodeParams,
  VerifyRefreshTokenParams,
  RefreshAccessTokenParams,
} from "@/auth/types/util/jwt.util.types.js";

export class JWTUtil {
  static async generateTokens({
    tokenPayload,
    refreshTokenPayload = {},
    generateRefreshToken = false,
  }: GenerateTokensParams) {
    if (!tokenPayload) {
      throw new Error("Token payload is needed to generate the token");
    }

    // Extract secret and expiresIn with fallback
    const secret = tokenPayload.JWT_SECRET || process?.env?.JWT_SECRET || "";
    if (!secret) {
      throw new Error("JWT secret is required");
    }

    // Create SignOptions with optional expiresIn
    const expiresIn = tokenPayload.expiresIn
      ? (tokenPayload.expiresIn as string | number)
      : undefined;

    const signOptions: SignOptions = {};
    if (expiresIn) {
      signOptions.expiresIn = (process?.env?.ACCESS_TOKEN_EXPIRE_TIME ||
        "25m") as StringValue;
    }

    if (generateRefreshToken) {
      return {
        accessToken: jwt.sign(tokenPayload.payload || {}, secret, signOptions),
        refreshToken: await this.generateRefreshToken({
          payload: tokenPayload.payload,
          ...refreshTokenPayload,
        }),
      };
    } else {
      // fallback for generateRefreshToken = false
      const { payload } = tokenPayload;
      return jwt.sign(payload || {}, secret, signOptions);
    }
  }

  static async generateRefreshToken({
    payload,
    REFRESH_SECRET = process?.env?.REFRESH_SECRET || "",
    expiresIn = "7d",
  }: RefreshTokenPayload) {
    if (!payload) {
      throw new Error("Token payload is needed to generate the token");
    }
    if (!REFRESH_SECRET) {
      throw new Error("Refresh secret is required");
    }

    const signOptions: SignOptions = {};
    if (!expiresIn) {
      signOptions.expiresIn = (process.env.REFRESH_TOKEN_EXPIRE_TOKEN ||
        "7d") as StringValue;
    }

    return jwt.sign(payload, REFRESH_SECRET, signOptions);
  }

  static async verify({ token, JWT_SECRET = "" }: VerifyParams) {
    try {
      const secret = JWT_SECRET || process?.env?.JWT_SECRET || "";
      if (!secret) throw new Error("JWT secret is required for verification");
      return jwt.verify(token, secret);
    } catch (err: any) {
      if (err.name === "TokenExpiredError") throw new TokenExpiredError();
      if (err.name === "JsonWebTokenError") throw new TokenInvalidError();
      throw err;
    }
  }

  static decode({ token }: DecodeParams) {
    return jwt.decode(token);
  }

  static async verifyRefreshToken({
    token,
    REFRESH_SECRET = process?.env?.REFRESH_SECRET || "",
  }: VerifyRefreshTokenParams) {
    try {
      if (!REFRESH_SECRET) {
        throw new Error("Refresh secret is required for verification");
      }
      const payload = jwt.verify(token, REFRESH_SECRET);
      return payload;
    } catch {
      throw new TokenInvalidError("Refresh token is invalid");
    }
  }

  static async refreshAccessToken({
    token,
    REFRESH_SECRET,
    JWT_SECRET,
  }: RefreshAccessTokenParams) {
    const payload = await this.verifyRefreshToken({ token, REFRESH_SECRET });

    if (payload) {
      return this.generateTokens({
        tokenPayload: {
          payload: payload as Record<string, any>,
          JWT_SECRET,
          expiresIn: process?.env?.ACCESS_TOKEN_EXPIRE_TIME || "25m",
        },
      });
    }

    return null;
  }
}
