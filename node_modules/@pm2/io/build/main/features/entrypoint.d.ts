import { IOConfig } from '../pmx';
export declare class Entrypoint {
    private io;
    constructor();
    events(): void;
    sensors(): void;
    actuators(): void;
    onStart(cb: Function): void;
    onStop(err: Error, cb: Function, code: number, signal: string): any;
    conf(): IOConfig | undefined;
}
