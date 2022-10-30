import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express, { Express } from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";

import { DocumentNode } from "graphql";
import bodyParser from "body-parser";
import helmet from "helmet";
import { typeDefs } from "./api/graphql/schemas";
import { resolvers } from "./api/graphql/resolvers";
import getLogger from "./utils/logger";
import morganMiddleware from "./api/middlewares/logger.middleware";
import { errorMiddleware } from "./api/middlewares/error.middleware";
import { Resolvers } from "./api/graphql/codegen/generated";
import routes from "./api/rest";
import config, { nodeEnvironnementEnum } from "./config";

const logger = getLogger("/index.ts");

// eslint-disable-next-line import/no-mutable-exports
export let app: Express;

const port = process.env.PORT ? process.env.PORT : 3001;
logger.info(`$PORT: ${port}`);

// eslint-disable-next-line @typescript-eslint/no-shadow
async function startServer(typeDefs: DocumentNode[], resolvers: Resolvers) {
  app = express();
  const httpServer = http.createServer(app);

  // Helmet can be use to add security headers
  // app.use(
  //   helmet({
  //     contentSecurityPolicy: false,
  //     frameguard: false,
  //   })
  // );
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
    })
  );

  app.use(morganMiddleware);
  app.use(cookieParser());
  app.use("/api", routes);
  app.use(errorMiddleware);

  // Set up Apollo Server
  // Uncomment if needed
  //   const server = new ApolloServer({
  //     typeDefs,
  //     resolvers,
  //     csrfPrevention: true,
  //     cache: "bounded",
  //     plugins: [
  //       ApolloServerPluginDrainHttpServer({ httpServer }),
  //       ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  //     ],
  //   });
  // await server.start();
  // server.applyMiddleware({
  //   app,
  // });

  logger.info("Server setup OK");
  if (config.env !== nodeEnvironnementEnum.TEST) {
    await new Promise<void>((resolve) => {
      httpServer.listen({ port }, resolve);
    });
    logger.info(`🚀 Server ready`);
  }
}

startServer(typeDefs, resolvers);
