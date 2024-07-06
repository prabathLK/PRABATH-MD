export declare const UnsupportedOperationError: {
    new (msg?: any): {
        origMessage: string;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace?: ((err: Error, stackTraces: NodeJS.CallSite[]) => any) | undefined;
    stackTraceLimit: number;
};
export declare const unsupported: (msg?: any) => never;
//# sourceMappingURL=unsupported.d.ts.map