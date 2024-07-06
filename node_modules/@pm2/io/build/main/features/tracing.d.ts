/// <reference types="node" />
import { Feature } from '../featureManager';
import { IOConfig } from '../pmx';
import * as httpModule from 'http';
import { IgnoreMatcher } from '../census/plugins/http';
import * as core from '@opencensus/core';
export interface TracingConfig {
    enabled: boolean;
    serviceName?: string;
    outbound?: boolean;
    samplingRate?: number;
    detailedDatabasesCalls?: boolean;
    ignoreIncomingPaths?: Array<IgnoreMatcher<httpModule.IncomingMessage>>;
    ignoreOutgoingUrls?: Array<IgnoreMatcher<httpModule.ClientRequest>>;
    createSpanWithNet?: boolean;
}
export declare class TracingFeature implements Feature {
    private exporter;
    private options;
    private tracer;
    private logger;
    init(config: IOConfig): void;
    private isDebugEnabled;
    getTracer(): core.Tracer | undefined;
    destroy(): void;
}
