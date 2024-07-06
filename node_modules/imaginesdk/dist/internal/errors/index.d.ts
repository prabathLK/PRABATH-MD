import createError from "http-errors";
export declare const ErrInvalidParameter: (message: string) => createError.HttpError<422>;
export declare const ErrNotFound: (message: string) => createError.HttpError<404>;
export declare const ErrDynamic: (status: number, message: string) => createError.HttpError<number>;
