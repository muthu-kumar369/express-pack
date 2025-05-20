export interface TokenPayload {
  payload: object;
  JWT_SECRET: string;
  expiresIn?: string | number;
}

export interface RefreshTokenPayload {
  payload?: object;
  REFRESH_SECRET?: string;
  expiresIn?: string | number;
}

export interface GenerateTokensParams {
  tokenPayload?: TokenPayload;
  refreshTokenPayload?: RefreshTokenPayload;
  generateRefreshToken?: boolean;
}

export interface VerifyParams {
  token: string;
  JWT_SECRET?: string;
}

export interface DecodeParams {
  token: string;
}

export interface VerifyRefreshTokenParams {
  token: string;
  REFRESH_SECRET?: string;
}

export interface RefreshAccessTokenParams {
  token: string;
  REFRESH_SECRET: string;
  JWT_SECRET: string;
}
