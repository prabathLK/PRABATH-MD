import { BasePlugin } from '@opencensus/core';
export declare class NetPlugin extends BasePlugin {
    constructor(moduleName: string);
    protected applyPatch(): any;
    applyUnpatch(): void;
    protected getPatchIncomingRequestFunction(): (original: (event: string) => boolean) => (event: string, ...args: any[]) => boolean;
}
export declare const plugin: NetPlugin;
