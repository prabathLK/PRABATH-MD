import { IOConfig } from './pmx';
export declare function getObjectAtPath(context: Object, path: string): any;
export declare class FeatureManager {
    private logger;
    init(options: IOConfig): void;
    get(name: string): Feature;
    destroy(): void;
}
export declare class FeatureConfig {
}
export interface Feature {
    init(config?: any): void;
    destroy(): void;
}
