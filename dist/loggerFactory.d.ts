import winston from "winston";
export declare class LoggerFactory {
    logger: winston.Logger;
    static getInstance(filename: string): LoggerFactory;
    constructor(label: string);
    private getLoggerFormats;
    private getLoggerTransports;
}
