import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
// import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
// import { ConsoleMetricExporter } from "@opentelemetry/exporter-metrics-console";
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter
} from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  TraceIdRatioBasedSampler
  // ConsoleSpanExporter,
  // SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-node';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

const samplePercentage = 1;

const otlpTraceExporter = new OTLPTraceExporter({
  url: 'https://ingress.eu-west-1.aws.dash0.com/v1/traces',
  headers: {
    Authorization: `Bearer ${process.env.DASH0_AUTHORIZATION_TOKEN}`
  }
});

const otlpMetricExporter = new OTLPMetricExporter({
  url: 'https://ingress.eu-west-1.aws.dash0.com/v1/metrics',
  // url: "https://api.eu-west-1.aws.dash0.com/api/prometheus",
  headers: {
    Authorization: `Bearer ${process.env.DASH0_AUTHORIZATION_TOKEN}`
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const otlpMetricReader = new PeriodicExportingMetricReader({
  exporter: otlpMetricExporter,
  exportIntervalMillis: 1000
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const consoleMetricReader = new PeriodicExportingMetricReader({
  exporter: new ConsoleMetricExporter(),
  exportIntervalMillis: 1000
});

const logExporter = new OTLPLogExporter({
  url: 'https://ingress.eu-west-1.aws.dash0.com/v1/logs',
  headers: {
    Authorization: `Bearer ${process.env.DASH0_AUTHORIZATION_TOKEN}`
  }
});

const otlpLogProcessor = new BatchLogRecordProcessor(logExporter);

// const tmpProvider = new NodeTracerProvider();

const sdk = new NodeSDK({
  sampler: new TraceIdRatioBasedSampler(samplePercentage),
  resource: new Resource({
    [SEMRESATTRS_SERVICE_NAME]: 'my-service-name'
  }),

  instrumentations: [
    // new PinoInstrumentation(),
    getNodeAutoInstrumentations({
      // "@opentelemetry/instrumentation-fs": {
      //   enabled: false,
      // },
    })
  ],
  traceExporter: otlpTraceExporter,
  spanProcessors: [
    // new SimpleSpanProcessor(new ConsoleSpanExporter()),
    new BatchSpanProcessor(otlpTraceExporter)
  ],
  metricReader: otlpMetricReader,
  logRecordProcessor: otlpLogProcessor
});

sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    // eslint-disable-next-line no-console
    .then(() => console.log('Metrics terminated'))
    // eslint-disable-next-line no-console
    .catch((error) => console.log('Error terminating metrics', error))
    .finally(() => process.exit(0));
});
