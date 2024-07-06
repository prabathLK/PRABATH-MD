import { Logger, Plugin, PluginNames, Tracer } from '@opencensus/core';
export declare class PluginLoader {
    private tracer;
    private logger;
    plugins: Plugin[];
    private hookState;
    constructor(logger: Logger, tracer: Tracer);
    private static defaultPackageName;
    static defaultPluginsFromArray(modulesToPatch: string[]): PluginNames;
    private getPackageVersion;
    loadPlugins(pluginList: PluginNames): void;
    unloadPlugins(): void;
    static set searchPathForTest(searchPath: string);
}
