import * as winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console({ level: "info" })],
});

export const dependencies = {
  getBcrypt: () => require("bcryptjs"),
  getLogger: () => logger,
};
