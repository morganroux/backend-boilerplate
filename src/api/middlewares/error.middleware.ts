import { Request, Response, NextFunction } from "express";
import getLogger from "../../utils/logger";

const logger = getLogger("Error Middleware");

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    next(err);
  }
  logger.error(`Critical error: ${err}`);
  if (err.stack) logger.error(`Stacktrace: ${err.stack}`);
  res.status(500).send("");
};

export const asyncErrorMiddleware =
  (handleReq: (request: Request, response: Response) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await handleReq(req, res);
      next();
    } catch (err) {
      next(err);
    }
  };
