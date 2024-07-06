import { BasePlugin, Span } from '@opencensus/core';
export type MysqlPluginConfig = {
    detailedCommands: boolean;
};
export declare class MysqlPlugin extends BasePlugin {
    protected options: MysqlPluginConfig;
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
declare const plugin: MysqlPlugin;
export { plugin };
