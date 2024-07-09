import { Feature } from '../featureManager';
export declare class NotifyOptions {
    catchExceptions: boolean;
}
export declare class ErrorContext {
    http?: Object;
    custom?: Object;
}
export declare class NotifyFeature implements Feature {
    private logger;
    private transport;
    private cache;
    private stackParser;
    init(options?: NotifyOptions): any;
    destroy(): void;
    getSafeError(err: any): Error;
    notifyError(err: Error | string | {}, context?: ErrorContext): any;
    private onUncaughtException;
    private onUnhandledRejection;
    private catchAll;
    expressErrorHandler(): (err: any, req: any, res: any, next: any) => any;
    koaErrorHandler(): (ctx: any, next: any) => Promise<void>;
}
