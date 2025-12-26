import { SessionOptions } from "express-session";

export type SessionCustomConfig = Partial<SessionOptions> & {
  cookie?: Partial<SessionOptions["cookie"]>;
};

const sessionConfig = {
  getConfig: (config: SessionCustomConfig = {}): SessionOptions => {
    const defaultCookie: SessionOptions["cookie"] = {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      domain: undefined,
      expires: undefined,
    };

    return {
      secret: process.env.SESSION_SECRET || "d9X#7vLp@8QwR!ZmFs3$GtjB2kVyN&Hz0",
      resave: false,
      saveUninitialized: false,
      rolling: false,
      proxy: process.env.NODE_ENV === "production",

      cookie: {
        ...defaultCookie,
        ...(config.cookie || {}),
      },

      ...config,
    };
  },
};

export default sessionConfig;
