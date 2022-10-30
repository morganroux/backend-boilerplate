import { Router } from "express";
import jwt from "jsonwebtoken";
import { asyncErrorMiddleware } from "../middlewares/error.middleware";
import getLogger from "../../utils/logger";
import { getTest } from "../../services/prisma/test";
import {
  authMiddleware,
  requireLoggedIn,
  requireNotLoggedIn,
} from "../middlewares/auth.middleware";
import config from "../../config";

const router = Router();
const logger = getLogger("Auth routes");

router.use(authMiddleware);

router.get(
  "/test",
  requireLoggedIn,
  asyncErrorMiddleware(async (req, res) => {
    const test = await getTest("test");
    logger.info("Yay ! auth works !");
    res.status(200).send(`Yay ! auth works ! ${JSON.stringify(test)}`);
  })
);

router.use(
  "/setCookie",
  requireNotLoggedIn,
  asyncErrorMiddleware(async (req, res) => {
    const payload = jwt.sign(
      { test: "This is a cookie test" },
      config.cookies.jwtSecret
    );
    res
      .cookie(config.cookies.name, payload, {
        ...config.cookies.options,
      })
      .status(200)
      .send("cookies set");
  })
);
export default router;
