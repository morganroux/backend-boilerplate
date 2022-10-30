import { Router } from "express";
import globalRoutes from "./globalRoutes";
import dataRoutes from "./dataRoutes";
import commandRoutes from "./commandRoutes";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.use(authMiddleware);
router.use("/", globalRoutes);
router.use("/data", dataRoutes);
router.use("/commands", commandRoutes);
export default router;
