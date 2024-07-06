export declare class FormDataBuilder {
    private data;
    constructor();
    integer(key: string, value: number | null | undefined, defaultValue?: number): this;
    float(key: string, value: number | null | undefined, defaultValue?: number): this;
    string(key: string, value: string | null | undefined, defaultValue?: string): this;
    blob(key: string, value: Blob | null | undefined, defaultValue?: Blob): this;
    boolean(key: string, value: boolean | null | undefined, defaultValue?: boolean): this;
    build(): FormData;
}
export default FormDataBuilder;
