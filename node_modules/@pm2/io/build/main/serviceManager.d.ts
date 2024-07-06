export declare class Service {
}
export declare class ServiceManager {
    static get(serviceName: string): any | undefined;
    static set(serviceName: string, service: Service): Map<string, any>;
    static reset(serviceName: string): boolean;
}
