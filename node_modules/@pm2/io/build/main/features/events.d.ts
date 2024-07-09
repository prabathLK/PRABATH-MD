import { Feature } from '../featureManager';
export declare class EventsFeature implements Feature {
    private transport;
    private logger;
    init(): void;
    emit(name?: string, data?: any): any;
    destroy(): void;
}
