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
  cookies: {
    jwtSecret: process.env.JWT_SECRET as string,
    name: process.env.COOKIE_NAME as string,
    options: {
      domain: process.env.COOKIE_DOMAIN as string,
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
    origin: [/\.local\.test/, /\.talent-soft\.com$/, /localhost/],
    credentials: true,
  },
  cookies: {
    jwtSecret: process.env.JWT_SECRET as string,
    name: process.env.COOKIE_NAME as string,
    options: { domain: process.env.COOKIE_DOMAIN as string },
  },
};

export default ((process.env.NODE_ENV as nodeEnvironnementEnum) ??
  nodeEnvironnementEnum.PRODUCTION) === nodeEnvironnementEnum.PRODUCTION
  ? configProd
  : configLocal;
