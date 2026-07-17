import morgan from "morgan";
import { logger } from "../utils/logger";

const stream = {
  write: (message: string) => logger.info(message.trim()),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

export const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);
