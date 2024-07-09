/// <reference types="node" />
import { GitExecutorResult, SimpleGitExecutor } from './index';
import { EmptyTask } from '../tasks/task';
export declare type TaskResponseFormat = Buffer | string;
export interface TaskParser<INPUT extends TaskResponseFormat, RESPONSE> {
    (stdOut: INPUT, stdErr: INPUT): RESPONSE;
}
export interface EmptyTaskParser {
    (executor: SimpleGitExecutor): void;
}
export interface SimpleGitTaskConfiguration<RESPONSE, FORMAT, INPUT extends TaskResponseFormat> {
    commands: string[];
    format: FORMAT;
    parser: TaskParser<INPUT, RESPONSE>;
    onError?: (result: GitExecutorResult, error: Error, done: (result: Buffer | Buffer[]) => void, fail: (error: string | Error) => void) => void;
}
export declare type StringTask<R> = SimpleGitTaskConfiguration<R, 'utf-8', string>;
export declare type BufferTask<R> = SimpleGitTaskConfiguration<R, 'buffer', Buffer>;
export declare type RunnableTask<R> = StringTask<R> | BufferTask<R>;
export declare type SimpleGitTask<R> = RunnableTask<R> | EmptyTask;
