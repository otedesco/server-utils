import express, { Application } from "express";
import { ConfigOptions } from "./interfaces";
export declare abstract class AppFactory {
    app: Application;
    private env;
    private port;
    private logger;
    constructor(config: ConfigOptions);
    private initializeExpressMiddlewares;
    private initializeRoutes;
    protected abstract initializeConnections(): Promise<void>;
    protected abstract initializeErrorHandling(): void;
    listen(): void;
    getServer(): express.Application;
}
