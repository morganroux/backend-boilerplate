import { Router, Request, Response } from "express";
import { requireLoggedIn } from "../middlewares/auth.middleware";
import { asyncErrorMiddleware } from "../middlewares/error.middleware";
import { requireDiscovery } from "../middlewares/discovery.middleware";

const router = Router();

router.get("/", (req, res) => res.send("hello"));

router.get("/cookie", (req, res) => {
  res.send(`<html>${JSON.stringify(req.cookies)}</html>`);
});

router.get("/tenantCheck", (req, res) => {
  res.status(200).send(req.uaContext.globals.tenant);
});

router.get(
  "/discovery",
  asyncErrorMiddleware(async (req: Request, res: Response) => {
    res.status(200).send(req.uaContext.globals.discoveryUrls);
  })
);

router.get(
  "/me",
  requireDiscovery,
  requireLoggedIn,
  asyncErrorMiddleware(async (req, res) => {
    const { token, ...info } = req.uaContext.globals.authPayload!;
    res.status(200).json(info);
  })
);

export default router;
