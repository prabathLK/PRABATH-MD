export declare class Action {
    handler: Function;
    name: string;
    type: string;
    isScoped: boolean;
    callback?: Function;
    arity: number;
    opts: Object | null | undefined;
}
export declare class ActionService {
    private timer;
    private transport;
    private actions;
    private logger;
    private listener;
    init(): void;
    destroy(): void;
    registerAction(actionName?: string, opts?: Object | undefined | Function, handler?: Function): void;
    scopedAction(actionName?: string, handler?: Function): any;
}
