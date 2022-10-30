import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError } from "jsonwebtoken";
import getLogger from "../../utils/logger";
import config from "../../config";
import { SiteTypeEnum } from "../../services/discoveryFactory/components/base";
import { getIdentityProvider } from "../../services/identityProviderFactory";
import { extractSessionPayload } from "../../services/identityProviderFactory/utils";

const logger = getLogger("Auth middleware");

export const requireLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.uaContext.globals.authPayload) res.status(401).send();
  else next();
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const UACookie = req.cookies?.[config.cookies.name];
    const { discoveryUrls } = req.uaContext.globals;
    if (UACookie && discoveryUrls) {
      const sessionPayload = await extractSessionPayload(UACookie);
      // TODO: improve security here. But tsmain instance name and federation userinfo dont match on the tenant name they provide
      // (expl: qual08 for federation, cpl_qual_qual08 for tsmain)
      // if (sessionPayload.tenant !== req.uaContext.globals.tenant)
      //   throw new Error("Tenant and cookie don't match");
      const idP = getIdentityProvider(
        discoveryUrls[SiteTypeEnum.AUTHENTICATION]
      );
      const token = await idP.getAccessToken(sessionPayload.user);
      req.uaContext.globals.authPayload = { token, ...sessionPayload };
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
