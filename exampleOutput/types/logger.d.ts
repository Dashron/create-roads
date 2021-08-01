import { Context, Middleware } from 'roads/types/core/road';
export interface Logger {
    log: (data: any) => any;
    warn: (warning: any) => any;
    info: (details: any) => any;
    error: (err: any) => any;
}
export declare function buildLoggerMiddleware(logger: Logger): Middleware<Context>;
/**
 * This is a super simple logger for the purposes of this example. Every function used in this example
 * 		is used by roads, and expected to exist in the logging
 * object that you provide to the projects
 */
export declare function createLogger(logName: string): Logger;
