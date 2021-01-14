function generateCustomError(
  level: string,
  error: Error,
  statusCode: number,
  additionalInfo?: any
) {
  return {
    level,
    statusCode,
    message: error.message,
    stack: error.stack,
    additionalInfo,
  };
}

const level: any = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  HTTP: "http",
  VERBOSE: "verbose",
  DEBUG: "debug",
  SILLY: "silly",
};

export { generateCustomError, level };
