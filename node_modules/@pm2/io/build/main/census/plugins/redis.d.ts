import { BasePlugin, Span } from '@opencensus/core';
import * as redis from 'redis';
export type Redis = typeof redis;
export type IgnoreMatcher = string | RegExp;
export type RedisPluginConfig = {
    detailedCommands: boolean;
};
export declare class RedisPlugin extends BasePlugin {
    protected options: RedisPluginConfig;
    constructor(moduleName: string);
    protected applyPatch(): any;
    applyUnpatch(): void;
    private getPatchCreateStream;
    private getPatchCreateClient;
    private getPatchSendCommand;
    patchEnd(span: Span, resultHandler: Function): Function;
}
declare const plugin: RedisPlugin;
export { plugin };
