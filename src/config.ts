import "dotenv/config";

export enum nodeEnvironnementEnum {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
  TEST = "test",
}
interface Config {
  env: nodeEnvironnementEnum;
  cors: {
    origin: (string | RegExp)[];
    credentials: boolean;
  };
  tsMain: {
    url: string;
    clientId: string;
    clientSecret: string;
  };
  identityProvider: {
    clientId: string;
    secret: string;
    redirectUri: string;
    scope: string;
  };
  cookies: {
    jwtSecret: string;
    name: string;
    options: {
      domain?: string;
      sameSite?: boolean | "lax" | "strict" | "none";
      secure?: boolean;
      httpOnly?: boolean;
    };
  };
}

const configProd: Config = {
  env:
    (process.env.NODE_ENV as nodeEnvironnementEnum) ??
    nodeEnvironnementEnum.PRODUCTION,
  cors: {
    origin: [
      "https://missy.azureedge.net",
      "https://missy-staging.azureedge.net",
      /\.talent-soft\.com$/,
    ],
    credentials: true,
  },
  tsMain: {
    url: process.env.TSMAIN_URL as string,
    clientId: process.env.TSMAIN_CLIENT_ID as string,
    clientSecret: process.env.TSMAIN_CLIENT_SECRET as string,
  },
  identityProvider: {
    clientId: process.env.USERASSISTANT_FED_CLIENT_ID as string,
    secret: process.env.USERASSISTANT_FED_SECRET as string,
    redirectUri: process.env.USERASSISTANT_FED_REDIRECT_URI as string,
    scope: "openid offline_access talentsoft.career.api.read",
  },
  cookies: {
    jwtSecret: process.env.USERASSISTANT_JWT_SECRET as string,
    name: process.env.USERASSISTANT_COOKIE_NAME as string,
    options: {
      domain: process.env.USERASSISTANT_COOKIE_DOMAIN as string,
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
};

const configLocal: Config = {
  env:
    (process.env.NODE_ENV as nodeEnvironnementEnum) ??
    nodeEnvironnementEnum.PRODUCTION,
  cors: {
    origin: [/\.local\.test/, /\.talent-soft\.com$/],
    credentials: true,
  },
  tsMain: {
    url: process.env.TSMAIN_URL as string,
    clientId: process.env.TSMAIN_CLIENT_ID as string,
    clientSecret: process.env.TSMAIN_CLIENT_SECRET as string,
  },
  identityProvider: {
    clientId: process.env.USERASSISTANT_FED_CLIENT_ID as string,
    secret: process.env.USERASSISTANT_FED_SECRET as string,
    redirectUri: process.env.USERASSISTANT_FED_REDIRECT_URI as string,
    scope: "openid offline_access talentsoft.career.api.read",
  },
  cookies: {
    jwtSecret: process.env.USERASSISTANT_JWT_SECRET as string,
    name: process.env.USERASSISTANT_COOKIE_NAME as string,
    options: { domain: process.env.USERASSISTANT_COOKIE_DOMAIN as string },
  },
};

//TODO: check if some env are undefined

export default ((process.env.NODE_ENV as nodeEnvironnementEnum) ??
  nodeEnvironnementEnum.PRODUCTION) === nodeEnvironnementEnum.PRODUCTION
  ? configProd
  : configLocal;
