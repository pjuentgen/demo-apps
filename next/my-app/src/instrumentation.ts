import { registerOTel } from "@vercel/otel";
import { TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-node'
import { credentials } from "./app/credentials";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

export function register() {  
  registerOTel({
    serviceName: "my-first-observable-service",
    traceSampler: new TraceIdRatioBasedSampler(0.1),
    traceExporter: new OTLPTraceExporter(credentials),
    instrumentationConfig: {
      fetch: {
        propagateContextUrls: [],
      },
    },
  });
}
