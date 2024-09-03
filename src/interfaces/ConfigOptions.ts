import type { CorsOptions } from "cors";

import type { LoggerFactory } from "../LoggerFactory";
import type Route from "./Route";

type ApiVersionRouters = { version: string; routes: Route[] };

export default interface ConfigOptions {
  routes: ApiVersionRouters[];
  env?: "development" | "production" | "test";
  port?: number;

  logger: LoggerFactory["logger"];
  logFormat?: string;
  cors?: CorsOptions;
}
