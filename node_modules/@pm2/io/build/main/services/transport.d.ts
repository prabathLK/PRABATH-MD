import { Action } from './actions';
import { InternalMetric } from './metrics';
import { EventEmitter2 } from 'eventemitter2';
export declare class TransportConfig {
    publicKey: string;
    secretKey: string;
    appName: string;
    serverName?: string;
    sendLogs?: Boolean;
    logFilter?: string | RegExp;
    disableLogs?: Boolean;
    proxy?: string;
}
export interface Transport extends EventEmitter2 {
    init: (config: TransportConfig) => Transport;
    destroy: () => void;
    send: (channel: string, payload: Object) => void;
    addAction: (action: Action) => void;
    setMetrics: (metrics: InternalMetric[]) => void;
    setOptions: (options: any) => void;
}
export declare function createTransport(name: string, config: TransportConfig): Transport;
