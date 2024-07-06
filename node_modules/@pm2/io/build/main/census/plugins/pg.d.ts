import { BasePlugin } from '@opencensus/core';
export type PGPluginConfig = {
    detailedCommands: boolean;
};
export declare class PGPlugin extends BasePlugin {
    protected options: PGPluginConfig;
    protected readonly internalFileList: {
        '6 - 7': {
            client: string;
        };
    };
    constructor(moduleName: string);
    protected applyPatch(): any;
    applyUnpatch(): void;
    private getPatchCreateQuery;
    private patchCallback;
    private patchSubmittable;
    private patchPromise;
    private populateLabelsFromInputs;
    private populateLabelsFromOutputs;
}
declare const plugin: PGPlugin;
export { plugin };
