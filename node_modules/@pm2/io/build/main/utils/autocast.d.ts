export default class Autocast {
    commonStrings: {
        true: boolean;
        false: boolean;
        undefined: undefined;
        null: null;
        NaN: number;
    };
    process(key: any, value: any, o: any): void;
    traverse(o: any, func: any): void;
    autocast(s: any): any;
    private _cast;
}
