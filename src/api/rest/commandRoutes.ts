import { Router, Response, Request } from "express";
import { requireLoggedIn } from "../middlewares/auth.middleware";
import { requireDiscovery } from "../middlewares/discovery.middleware";
import { asyncErrorMiddleware } from "../middlewares/error.middleware";
import { buildCommands } from "../../services/commandBuilder";
import { executeCommand } from "../../services/commandExecutor";
import getLogger from "../../utils/logger";
import { FormattedCommand } from "../../types/commands.types";

const router = Router();
const logger = getLogger("Command routes");

router.post("/test", (req: Request, res: Response) => {
  logger.info(`Test : ${JSON.stringify(req.body)}`);
  res.status(200).send(req.body);
});

router.post(
  "/",
  requireDiscovery,
  requireLoggedIn,
  asyncErrorMiddleware(async (req: Request, res: Response) => {
    const commands = await buildCommands(req.uaContext);
    res.status(200).send(commands);
  })
);
router.post(
  "/exec",
  requireDiscovery,
  requireLoggedIn,
  asyncErrorMiddleware(async (req: Request, res: Response) => {
    if (!req.body.command) res.status(400).send();
    const command: FormattedCommand = req.body.command;
    const result = await executeCommand(command, req.uaContext);
    res.status(200).send(result);
  })
);
export default router;
