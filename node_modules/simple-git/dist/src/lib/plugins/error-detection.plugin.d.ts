/// <reference types="node" />
import { GitExecutorResult, SimpleGitPluginConfig } from '../types';
import { SimpleGitPlugin } from './simple-git-plugin';
declare type TaskResult = Omit<GitExecutorResult, 'rejection'>;
declare function isTaskError(result: TaskResult): boolean;
export declare function errorDetectionHandler(overwrite?: boolean, isError?: typeof isTaskError, errorMessage?: (result: TaskResult) => Buffer | Error): (error: Buffer | Error | undefined, result: TaskResult) => Error | Buffer | undefined;
export declare function errorDetectionPlugin(config: SimpleGitPluginConfig['errors']): SimpleGitPlugin<'task.error'>;
export {};
