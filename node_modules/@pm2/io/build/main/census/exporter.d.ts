import { TracingConfig } from 'src/features/tracing';
import { Exporter, ExporterBuffer, ExporterConfig, RootSpan } from '@opencensus/core';
export interface ZipkinExporterOptions extends ExporterConfig {
    serviceName: string;
}
export declare class CustomCensusExporter implements Exporter {
    private config;
    private transport;
    buffer: ExporterBuffer;
    constructor(config: TracingConfig);
    onEndSpan(root: RootSpan): void;
    onStartSpan(root: RootSpan): void;
    private sendTraces;
    private mountSpanList;
    private translateSpan;
    publish(rootSpans: RootSpan[]): Promise<string | number | void>;
    private getSpanKind;
}
