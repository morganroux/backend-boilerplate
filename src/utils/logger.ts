import winston from "winston";
import config, { nodeEnvironnementEnum } from "../config";

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   debug: 4,
// }

const level = () => {
  const isDevelopment = config.env === nodeEnvironnementEnum.DEVELOPMENT;
  return isDevelopment ? "debug" : "info";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  // it's okay since we're not in UI but in backend
  // eslint-disable-next-line @cegid/no-hardcoded-colors
  debug: "white",
};

winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const namespaceMessage = info.namespace ? `- ${info.namespace} ` : "";
    return `[${info.level}] ${info.timestamp} ${namespaceMessage}: ${info.message}`;
  })
);

const transports = [new winston.transports.Console()];

const logger = winston.createLogger({
  level: level(),
  format,
  transports,
});

const getLogger = (namespace?: string) => {
  if (namespace) {
    return logger.child({ namespace });
  }
  return logger;
};

export default getLogger;
