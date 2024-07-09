export default class Configuration {
    static configureModule(opts: any): void;
    static findPackageJson(): string | null | undefined;
    static init(conf: any, doNotTellPm2?: any): any;
    static getMain(): any;
}
