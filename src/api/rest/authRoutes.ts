import { Router } from "express";
import { requireDiscovery } from "../middlewares/discovery.middleware";
import { asyncErrorMiddleware } from "../middlewares/error.middleware";
import config from "../../config";
import getLogger from "../../utils/logger";
import { SiteTypeEnum } from "../../services/discoveryFactory/components/base";
import { getIdentityProvider } from "../../services/identityProviderFactory";

const router = Router();
const logger = getLogger("Auth routes");

router.get(
  "/auth",
  requireDiscovery,
  asyncErrorMiddleware(async (req, res) => {
    const idP = getIdentityProvider(
      req.uaContext.globals.discoveryUrls![SiteTypeEnum.AUTHENTICATION]
    );
    const url = await idP.buildOidcAuthorizationUrl();
    res.redirect(301, url);
  })
);

router.get(
  "/signin-oidc",
  requireDiscovery,
  asyncErrorMiddleware(async (req, res) => {
    if (!req.uaContext.globals.discoveryUrls) {
      logger.error("discovery urls are null or undefined");
      throw new Error("discovery urls are null or undefined");
    }
    const { code } = req.query;
    const idP = getIdentityProvider(
      req.uaContext.globals.discoveryUrls[SiteTypeEnum.AUTHENTICATION]
    );
    const tokenData = await idP.getTokenFromIdp(code as string);
    await idP.storeToken(tokenData);
    const { sessionCookie } = await idP.buildSessionCookie(tokenData);
    res
      .cookie(config.cookies.name, sessionCookie, config.cookies.options)
      .status(200)
      .send();
  })
);

export default router;
