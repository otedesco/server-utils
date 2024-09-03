import appRoot from "app-root-path";
import { existsSync, mkdirSync } from "node:fs";
import { basename } from "node:path";
import { createLogger, format, type Logger, transports } from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logsDirectory = `${appRoot.path}/logs`;

const loggerInstances = new Map<string, LoggerFactory>();

export class LoggerFactory {
  public logger: Logger;

  public static getInstance(filename: string) {
    const label = basename(filename);

    const instance = loggerInstances.get(label);
    if (instance) return instance;

    return new LoggerFactory(label);
  }

  constructor(label: string) {
    if (!existsSync(logsDirectory)) {
      mkdirSync(logsDirectory);
    }

    this.logger = createLogger({
      format: this.getLoggerFormats(label),
      transports: Object.values(this.getLoggerTransports()),
    });
    this.logger.add(
      new transports.Console({
        format: format.combine(format.splat(), format.colorize()),
      }),
    );

    loggerInstances.set(label, this);
  }

  public getLoggerFormats = (label: string): Logger["format"] => {
    const formatLabel = format.label({
      label,
    });
    const formatTimestamp = format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    });
    const formatPrintf = format.printf(
      ({ level, message, label: _label, timestamp, stack }) =>
        `${timestamp} ${level} [${_label}] ${message} ${stack || ""}`,
    );

    return format.combine(formatLabel, formatTimestamp, formatPrintf);
  };

  public getLoggerTransports = () => {
    const debugTransport = new winstonDaily({
      level: "debug",
      datePattern: "YYYY-MM-DD",
      dirname: `${logsDirectory}/debug`,
      filename: "%DATE%.log",
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    });
    const errorTransport = new winstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: `${logsDirectory}/error`,
      filename: "%DATE%.log",
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    });

    return { debugTransport, errorTransport };
  };
}
