/// <reference types="node" />
/// <reference types="node" />
import { BasePlugin, Func } from '@opencensus/core';
import * as httpModule from 'http';
import * as url from 'url';
export type IgnoreMatcher<T> = string | RegExp | ((url: string, request: T) => boolean);
export type HttpPluginConfig = {
    ignoreIncomingPaths: Array<IgnoreMatcher<httpModule.IncomingMessage>>;
    ignoreOutgoingUrls: Array<IgnoreMatcher<httpModule.ClientRequest>>;
    createSpanWithNet: boolean;
};
export type HttpModule = typeof httpModule;
export type RequestFunction = typeof httpModule.request;
export declare class HttpPlugin extends BasePlugin {
    static ATTRIBUTE_HTTP_HOST: string;
    static ATTRIBUTE_HTTP_METHOD: string;
    static ATTRIBUTE_HTTP_PATH: string;
    static ATTRIBUTE_HTTP_ROUTE: string;
    static ATTRIBUTE_HTTP_USER_AGENT: string;
    static ATTRIBUTE_HTTP_STATUS_CODE: string;
    static ATTRIBUTE_HTTP_ERROR_NAME: string;
    static ATTRIBUTE_HTTP_ERROR_MESSAGE: string;
    protected options: HttpPluginConfig;
    constructor(moduleName: string);
    protected applyPatch(): any;
    protected applyUnpatch(): void;
    protected isIgnored<T>(url: string, request: T, list: Array<IgnoreMatcher<T>>): boolean;
    protected isSatisfyPattern<T>(url: string, request: T, pattern: IgnoreMatcher<T>): boolean;
    protected getPatchIncomingRequestFunction(): (original: (event: string) => boolean) => (event: string, ...args: any[]) => boolean;
    protected getPatchOutgoingRequestFunction(): (original: Func<httpModule.ClientRequest>) => Func<httpModule.ClientRequest>;
    private getMakeRequestTraceFunction;
    private createSpan;
    static convertTraceStatus(statusCode: number): number;
    hasExpectHeader(options: httpModule.ClientRequestArgs | url.URL): boolean;
}
export declare enum TraceStatusCodes {
    UNKNOWN = 2,
    OK = 0,
    INVALID_ARGUMENT = 3,
    DEADLINE_EXCEEDED = 4,
    NOT_FOUND = 5,
    PERMISSION_DENIED = 7,
    UNAUTHENTICATED = 16,
    RESOURCE_EXHAUSTED = 8,
    UNIMPLEMENTED = 12,
    UNAVAILABLE = 14
}
export declare const plugin: HttpPlugin;
