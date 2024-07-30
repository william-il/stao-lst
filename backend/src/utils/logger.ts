import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
const { combine, timestamp, printf, errors, json, splat } = winston.format;

const logDir = path.join(__dirname, '..', 'logData');
const transportOptions = {
  maxSize: '5m',
  maxFiles: 1,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
};

/*
 winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(
      ({ level, message, timestamp, filePath, ...metadata }) => {
        let msg = `${timestamp} [${level}] ${filePath}: ${message}`;
        if (Object.keys(metadata).length > 0) {
          msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
      }
    )
  )
*/
const bigIntReplacer = (key: string, value: any) =>
  typeof value === 'bigint' ? value.toString() : value;

// Function to get the caller's file name
function getCallerFileName() {
  const err = new Error();
  Error.prepareStackTrace = (_, stack) => stack;
  const stack = err.stack as unknown as NodeJS.CallSite[];
  Error.prepareStackTrace = undefined;

  // Find the first stack frame that isn't from this file
  const callerFrame = stack.find((frame) => frame.getFileName() !== __filename);

  return callerFrame
    ? path.basename(callerFrame.getFileName() || '')
    : 'unknown';
}

const logFormat = winston.format.printf(
  ({ level, message, timestamp, fileName, ...metadata }) => {
    let msg = `${timestamp} [${level}] ${fileName}: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata, bigIntReplacer)}`;
    }
    return msg;
  }
);

const loggerC = winston.createLogger({
  level: 'info',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  defaultMeta: { service: 'blockchain-processor' },
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.cli()
      ),
    }),

    // Combined
    new winston.transports.DailyRotateFile({
      ...transportOptions,
      filename: path.join(logDir, 'combined-%DATE%.log'),
    }),

    // Errors
    new winston.transports.DailyRotateFile({
      ...transportOptions,
      filename: path.join(logDir, 'error-%DATE%.log'),
      level: 'error',
    }),

    // Warnings
    new winston.transports.DailyRotateFile({
      ...transportOptions,
      filename: path.join(logDir, 'warn-%DATE%.log'),
      level: 'warn',
    }),

    // Info logs
    new winston.transports.DailyRotateFile({
      ...transportOptions,
      filename: path.join(logDir, 'info-%DATE%.log'),
      level: 'info',
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
    }),
  ],
});
class Logger {
  public logger: winston.Logger;

  constructor() {
    this.logger = loggerC;
  }

  private formatError(error: unknown): Record<string, unknown> {
    if (error instanceof Error) {
      return {
        errorType: error.constructor.name,
        errorMessage: error.message,
        errorStack: error.stack,
      };
    } else if (typeof error === 'string') {
      return {
        errorType: 'String',
        errorMessage: error,
      };
    } else if (typeof error === 'object' && error !== null) {
      return {
        errorType: 'Object',
        errorMessage: JSON.stringify(error, bigIntReplacer),
      };
    }
    return {
      errorType: 'Unknown',
      errorMessage: 'An unknown error occurred',
    };
  }

  private logWithFilePath(
    level: string,
    message: string,
    metadata: Record<string, unknown> = {}
  ) {
    const filePath = getCallerFileName();
    this.logger.log(level, message, {
      ...metadata,
      filePath,
    });
  }

  public error(
    message: string,
    error: unknown,
    metaData: Record<string, unknown> = {}
  ) {
    this.logger.error(message, {
      ...metaData,
      ...this.formatError(error),
    });
  }

  public warn(message: string, metadata: Record<string, unknown> = {}) {
    this.logWithFilePath('warn', message, metadata);
  } 

  public info(message: string, metadata: Record<string, unknown> = {}) {
    this.logWithFilePath('info', message, metadata);
  }

  public debug(message: string, metadata: Record<string, unknown> = {}) {
    this.logWithFilePath('debug', message, metadata);
  }
}

const logger = new Logger();
export default logger;
