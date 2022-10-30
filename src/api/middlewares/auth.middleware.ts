import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import getLogger from "../../utils/logger";
import config from "../../config";

const logger = getLogger("Auth middleware");

export const requireLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req?.context?.sessionPayload) res.status(401).send();
  else next();
};

export const requireNotLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.context?.sessionPayload) res.status(401).send();
  else next();
};

const extractSessionPayload = async (jwtToken: string) => {
  const jwtDecoded = await jwt.verify(jwtToken, config.cookies.jwtSecret);

  return jwtDecoded;
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.cookies?.[config.cookies.name];
    if (cookie) {
      const sessionPayload = await extractSessionPayload(cookie);
      req.context = {};
      req.context.sessionPayload = sessionPayload;
    }
    next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      logger.error("Error when verifying auth token");
    }
    logger.error(err);
    logger.error((err as Error).stack);
    logger.error(`Cookies: ${JSON.stringify(req.cookies)}`);
    // This clears cookie
    res
      .cookie(config.cookies.name, "", {
        ...config.cookies.options,
        expires: new Date(0),
      })
      .status(401)
      .send();
  }
};
