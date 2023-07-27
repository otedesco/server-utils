import { CorsOptions } from "cors";
import { LoggerFactory } from "../loggerFactory";
import { Route } from "./Route";
export type ApiVersionRouters = {
    version: string;
    routes: Route[];
};
export interface ConfigOptions {
    routes: ApiVersionRouters[] | Route[];
    env?: "development" | "production" | "test";
    port?: number;
    logger: LoggerFactory["logger"];
    logFormat?: string;
    cors?: CorsOptions;
}
