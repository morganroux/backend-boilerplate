import { Router } from "express";
import { loggers } from "winston";
import config from "../../config";
import { getTest } from "../../services/prisma/test";
import authRoutes from "./authRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/hello", async (req, res) => {
  const test = await getTest("test");
  // eslint-disable-next-line no-console
  console.log("===", test);
  res.status(200).send("Hello world!");
});

export default router;
