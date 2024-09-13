import { beforeEach,describe, expect, test } from "vitest";
import { Logger } from "winston";

import { LoggerFactory } from "../LoggerFactory";

describe("LoggerFactory Module", () => {
  let loggerFactory: LoggerFactory;

  const filename = "testFile.ts";

  beforeEach(() => {
    loggerFactory = LoggerFactory.getInstance(filename);
  });

  test("getInstance method returns instance of LoggerFactory", () => {
    expect(loggerFactory).toBeInstanceOf(LoggerFactory);
  });

  test("constructor initializes logger correctly", () => {
    expect(loggerFactory.logger).toBeInstanceOf(Logger);
  });

  test("logger formats are set correctly", () => {
    const formats = loggerFactory.getLoggerFormats(filename);
    expect(formats).toBeDefined();
  });

  test("logger transports are set correctly", () => {
    const transports = loggerFactory.getLoggerTransports();
    expect(transports.debugTransport).toBeDefined();
    expect(transports.errorTransport).toBeDefined();
  });
});
