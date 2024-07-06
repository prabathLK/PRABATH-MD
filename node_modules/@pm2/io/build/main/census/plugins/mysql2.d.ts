import { BasePlugin, Span } from '@opencensus/core';
export type Mysql2PluginConfig = {
    detailedCommands: boolean;
};
export declare class Mysql2Plugin extends BasePlugin {
    protected options: Mysql2PluginConfig;
    protected readonly internalFileList: {
        '1 - 3': {
            Connection: string;
            Pool: string;
        };
    };
    constructor(moduleName: string);
    protected applyPatch(): any;
    applyUnpatch(): void;
    private getPatchCreateQuery;
    private getPatchGetConnection;
    patchEnd(span: Span, resultHandler: Function): Function;
}
declare const plugin: Mysql2Plugin;
export { plugin };
