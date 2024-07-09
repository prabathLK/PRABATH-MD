/// <reference types="node" />
import * as inspector from 'inspector';
export declare class InspectorService {
    private session;
    private logger;
    init(): inspector.Session;
    getSession(): inspector.Session;
    destroy(): void;
}
