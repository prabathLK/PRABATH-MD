declare module 'require-in-the-middle' {
    namespace hook {
        type Options = {
            internals?: boolean;
        };
        type OnRequireFn = <T>(exports: T, name: string, basedir?: string) => T;
    }
    function hook(modules: string[] | null, options: hook.Options | null, onRequire: hook.OnRequireFn): void;
    function hook(modules: string[] | null, onRequire: hook.OnRequireFn): void;
    function hook(onRequire: hook.OnRequireFn): void;
    export = hook;
}
