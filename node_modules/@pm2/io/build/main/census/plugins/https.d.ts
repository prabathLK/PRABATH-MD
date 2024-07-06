import { HttpPlugin } from './http';
export declare class HttpsPlugin extends HttpPlugin {
    constructor();
    protected applyPatch(): any;
    private getPatchHttpsOutgoingRequest;
    protected applyUnpatch(): void;
}
declare const plugin: HttpsPlugin;
export { plugin };
