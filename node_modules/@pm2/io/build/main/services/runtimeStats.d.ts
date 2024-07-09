import { EventEmitter2 } from 'eventemitter2';
export declare class RuntimeStatsService extends EventEmitter2 {
    private logger;
    private handle;
    private noduleInstance;
    private enabled;
    init(): any;
    isEnabled(): boolean;
    destroy(): void;
}
