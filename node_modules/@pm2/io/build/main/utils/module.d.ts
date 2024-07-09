export default class ModuleUtils {
    static loadModule(modulePath: string, args?: Object): any | Error;
    static detectModule(moduleName: string): string | null;
    private static _lookForModule;
}
