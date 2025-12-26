import { Strategy } from "passport";

export interface StrategyConfig {
  name: string;
  strategy: Strategy;
}

export interface JWTStrategyOptions {
  secretOrKey: string;
  getUser: (payload: any) => Promise<any>;
}

export interface OAuthStrategyOptions {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
  getUser: (profile: any) => Promise<any>;
}

export interface PassportStrategyConfig {
  name: string;
  strategy: Strategy;
}

export type SerializeUserFn = (
  user: Express.User,
  done: (err: any, id?: unknown) => void
) => void;

export type DeserializeUserFn = (
  id: unknown,
  done: (err: any, user?: Express.User | false | null) => void
) => void;
