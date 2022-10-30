import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import express, { Express } from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";

import { typeDefs } from "./api/graphql/schemas";
import { resolvers } from "./api/graphql/resolvers";
import getLogger from "./utils/logger";
import morganMiddleware from "./api/middlewares/logger.middleware";
import { errorMiddleware } from "./api/middlewares/error.middleware";
import { DocumentNode } from "graphql";
import { Resolvers } from "./api/graphql/codegen/generated";
import routes from "./api/rest";
import { discoveryMiddleware } from "./api/middlewares/discovery.middleware";
import config, { nodeEnvironnementEnum } from "./config";
import { contextMiddleware } from "./api/middlewares/context.middleware";
import bodyParser from "body-parser";
import authRoutes from "./api/rest/authRoutes";
import { getSystemHealth } from "./services/healthChecker";
import helmet from "helmet";

const logger = getLogger("/index.ts");

export let app: Express;

const port = process.env.PORT ? process.env.PORT : 3001;
console.log("$PORT: ", port);

async function startServer(typeDefs: DocumentNode[], resolvers: Resolvers) {
  app = express();
  const httpServer = http.createServer(app);
  // TODO: add error handler ?
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
    })
  );
  app.use(bodyParser.json());
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
    })
  );
  app.get("/api/healthCheck", async (req, res) => {
    const health = await getSystemHealth();
    logger.info(`Health status: ${JSON.stringify(health)}`);
    res.status(health.code).send(health.status);
  });

  app.use(contextMiddleware);
  app.use(morganMiddleware);
  app.use(cookieParser());
  app.use(discoveryMiddleware);
  app.use(authRoutes);
  app.use("/api", routes);
  app.use(errorMiddleware);
  await server.start();
  server.applyMiddleware({
    app,
  });

  logger.info("Server setup OK");
  if (config.env !== nodeEnvironnementEnum.TEST) {
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));

    logger.info(`🚀 Server ready`);
    logger.info(`🚀 GraphQL path: ${server.graphqlPath}`);
  }
}

startServer(typeDefs, resolvers);
