import * as pino from "pino";

export const logger = pino({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL,
});

