import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from "passport-jwt";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
} from "passport-google-oauth20";
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile,
} from "passport-facebook";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";

import { Strategy } from "passport";
import {
  JWTStrategyOptions,
  OAuthStrategyOptions,
} from "../../types/util/passport.util.types";

export function createJwtStrategy(options: JWTStrategyOptions): Strategy {
  return new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: options.secretOrKey,
    },
    async (payload, done) => {
      try {
        const user = await options.getUser(payload);
        done(null, user || false);
      } catch (error) {
        done(error, false);
      }
    }
  );
}

export function createGoogleStrategy(options: OAuthStrategyOptions): Strategy {
  return new GoogleStrategy(
    {
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackURL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done
    ) => {
      try {
        const user = await options.getUser(profile);
        done(null, user || false);
      } catch (error) {
        done(error, false);
      }
    }
  );
}

export function createFacebookStrategy(
  options: OAuthStrategyOptions
): Strategy {
  return new FacebookStrategy(
    {
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackURL,
      profileFields: ["id", "displayName", "emails"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: FacebookProfile,
      done
    ) => {
      try {
        const user = await options.getUser(profile);
        done(null, user || false);
      } catch (error) {
        done(error, false);
      }
    }
  );
}

export function createGithubStrategy(options: OAuthStrategyOptions): Strategy {
  return new GitHubStrategy(
    {
      clientID: options.clientID,
      clientSecret: options.clientSecret,
      callbackURL: options.callbackURL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const user = await options.getUser(profile);
        done(null, user || false);
      } catch (error) {
        done(error, false);
      }
    }
  );
}
