import { BasePlugin, Span } from '@opencensus/core';
export declare class VuePlugin extends BasePlugin {
    private rendererResults;
    constructor(moduleName: string);
    protected applyPatch(): any;
    applyUnpatch(): void;
    private getPatchCreateRenderer;
    private getPatchRenderToString;
    patchEnd(span: Span): () => void;
}
declare const plugin: VuePlugin;
export { plugin };
