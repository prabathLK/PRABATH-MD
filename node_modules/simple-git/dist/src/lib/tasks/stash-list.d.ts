import { LogOptions, LogResult } from '../../../typings';
import type { StringTask } from '../types';
import type { EmptyTask } from './task';
export declare function stashListTask(opt: LogOptions<import("./log").DefaultLogFields> | undefined, customArgs: string[]): EmptyTask | StringTask<LogResult>;
