import * as core from '@opencensus/core';
export declare class Tracing implements core.Tracing {
    readonly tracer: core.Tracer;
    private pluginLoader;
    private defaultPlugins;
    private configLocal;
    private logger;
    private static singletonInstance;
    private activeLocal;
    constructor();
    static get instance(): core.Tracing;
    get active(): boolean;
    get config(): core.Config;
    start(userConfig?: core.Config): core.Tracing;
    stop(): void;
    get exporter(): core.Exporter;
    registerExporter(exporter: core.Exporter): core.Tracing;
    unregisterExporter(exporter: core.Exporter): core.Tracing;
}
