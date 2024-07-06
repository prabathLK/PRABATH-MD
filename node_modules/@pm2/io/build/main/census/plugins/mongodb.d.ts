import { BasePlugin, Span } from '@opencensus/core';
export type MongoPluginConfig = {
    detailedCommands: boolean;
};
export declare class MongoDBPlugin extends BasePlugin {
    protected options: MongoPluginConfig;
    protected readonly internalFileList: {
        '1 - 3': {
            ConnectionPool: string;
        };
    };
    constructor(moduleName: string);
    protected applyPatch(): any;
    applyUnpatch(): void;
    private getPatchCommand;
    private getPatchCursor;
    private getPatchEventEmitter;
    patchEnd(span: Span, resultHandler: Function): Function;
}
declare const plugin: MongoDBPlugin;
export { plugin };
