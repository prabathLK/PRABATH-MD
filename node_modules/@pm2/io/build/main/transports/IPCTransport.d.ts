import { Transport, TransportConfig } from '../services/transport';
import { Action } from '../services/actions';
import { InternalMetric } from '../services/metrics';
import { EventEmitter2 } from 'eventemitter2';
export declare class IPCTransport extends EventEmitter2 implements Transport {
    private initiated;
    private logger;
    private onMessage;
    private autoExitHandle;
    init(config?: TransportConfig): Transport;
    private autoExitHook;
    setMetrics(metrics: InternalMetric[]): void;
    addAction(action: Action): void;
    setOptions(options: any): -1 | undefined;
    send(channel: any, payload: any): -1 | undefined;
    destroy(): void;
}
