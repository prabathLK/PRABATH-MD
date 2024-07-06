/// <reference types="node" />
import { HttpPlugin } from './http';
import * as http2 from 'http2';
export type Http2Module = typeof http2;
export type ConnectFunction = typeof http2.connect;
export type CreateServerFunction = typeof http2.createServer;
export declare class Http2Plugin extends HttpPlugin {
    constructor();
    protected applyPatch(): any;
    protected applyUnpatch(): void;
    private getPatchConnectFunction;
    private getPatchRequestFunction;
    private getMakeHttp2RequestTraceFunction;
    private getPatchCreateServerFunction;
    private getPatchEmitFunction;
}
declare const plugin: Http2Plugin;
export { plugin };
