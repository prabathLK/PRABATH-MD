import { BasePlugin } from '@opencensus/core';
export declare const kMiddlewareStack: unique symbol;
export declare class ExpressPlugin extends BasePlugin {
    private kPatched;
    constructor(moduleName: string);
    protected applyPatch(): any;
    applyUnpatch(): void;
    private applyLayerPatch;
    private safePush;
    private patchEnd;
}
declare const plugin: ExpressPlugin;
export { plugin };
