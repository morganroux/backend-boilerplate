import { Request, Response, NextFunction } from "express";

// Initialize context
export const contextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let uaContext = {
    globals: {
      hostname: req.hostname,
      baseUrl: req.baseUrl,
      referer: req.headers.referer,
    },
    computed: {},
  };
  if (!!req.query.context) {
    uaContext.computed = {
      ...uaContext.computed,
      ...JSON.parse(req.query.context as string),
    };
  }
  if (!!req.body.context) {
    uaContext.computed = {
      ...uaContext.computed,
      ...req.body.context,
    };
  }
  req.uaContext = uaContext;
  next();
};
