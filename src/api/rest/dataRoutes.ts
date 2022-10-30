import { Router, Response, Request } from "express";
import { requireLoggedIn } from "../middlewares/auth.middleware";
import { requireDiscovery } from "../middlewares/discovery.middleware";
import { asyncErrorMiddleware } from "../middlewares/error.middleware";
import { buildRecords } from "../../services/recordBuilder";

const router = Router();

router.get(
  "/urls",
  requireDiscovery,
  requireLoggedIn,
  (req: Request, res: Response) => {
    res.status(200).send(req.uaContext.globals.discoveryUrls);
  }
);

router.post(
  "/records",
  requireDiscovery,
  requireLoggedIn,
  asyncErrorMiddleware(async (req: Request, res: Response) => {
    const records = await buildRecords(req.uaContext);
    res.status(200).send(records);
  })
);
export default router;
