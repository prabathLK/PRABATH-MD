import { Status } from "../enums/statuses";
import { Err } from "./error";
export interface Result<T> {
    status(): Status;
    data(): T | null;
    getOrThrow(): T;
    getOrElse(defaultValue: T): T;
    errorOrThrow(): Err;
}
export declare const error: <T>(err: Err, code: Status) => Result<T>;
export declare const success: <T>(content: T) => Result<T>;
