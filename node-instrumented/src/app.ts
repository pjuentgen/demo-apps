import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { metrics as otelMetrics } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import axios from 'axios';
import express, { Express } from 'express';

import { logger } from './logger';

// Configure OTLP metric exporter and SDK (metrics exported to OTLP endpoint)
const metricExporter = new OTLPMetricExporter();
const metricReader = new PeriodicExportingMetricReader({ exporter: metricExporter as any });

// Trace exporter (uses OTEL_EXPORTER_OTLP_ENDPOINT if set)
const traceExporter = new OTLPTraceExporter();

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
  traceExporter,
  metricReader: metricReader as any,
});
try {
  sdk.start();
} catch (err: unknown) {
  logger.error(`OpenTelemetry SDK failed to start: ${String(err)}`);
}

// Create OTEL Meter and Counter
const meter = otelMetrics.getMeter('node-instrumented-app');
const requestCounter = meter.createCounter('app_requests_total', {
  description: 'Total number of requests',
});

const app: Express = express();


const TIME: number = parseInt(process.env.TIME || '500');
const TIME_FOR_ERROR: number = parseInt(process.env.TIME_FOR_ERROR || '500');
const READIENESS_DELAY: number = parseInt(process.env.TIME_FOR_ERROR || '0');
const REMOTE_URL: string =
  process.env.REMOTE_URL || 'https://api.chucknorris.io/jokes/random';

app.get('/', (req, res) => {
  logger.info('Request to /');
  const randomTime = Math.floor(Math.random() * TIME);

  setTimeout(() => {
    if (randomTime > 300) {
      res.status(500).send('Error occured');
      logger.error('Error occured');

    } else {
      res.send('Hello World!');
    }
  }, randomTime);
});

app.get('/random-error', (req, res) => {
  logger.info('Request to /random-error');
  const randomTime = Math.floor(Math.random() * TIME);

  setTimeout(() => {
    if (randomTime > TIME_FOR_ERROR) {
      res.status(500).send('Error occured');
      logger.error('Error occured');
  requestCounter.add(1, { path: '/random-error', status: '500' });
    } else {
      res.send('Hello World!');
  requestCounter.add(1, { path: '/random-error', status: '200' });
    }
  }, randomTime);
});

app.get('/bad', (req, res) => {
  logger.info('Request to /bad');
  res.status(500).send('Error occured');
  logger.error('Error occured');
  requestCounter.add(1, { path: '/bad', status: '500' });
});

app.get('/healthy', (req, res) => {
  logger.info('Request to /healthy');
  res.send('Hello World!');
  requestCounter.add(1, { path: '/healthy', status: '200' });
});

app.get('/remote', async (req, res) => {
  logger.info('Request to /remote');
  logger.info('Connecting to ' + REMOTE_URL);
  try {
    const response = await axios.get(REMOTE_URL);
    const body = response.data;
    res.send(body);
  requestCounter.add(1, { path: '/remote', status: '200' });
  } catch (error: any) {
    logger.error(`Error occurred while fetching remote data: ${error?.message || error}`);
    res.status(500).send('Error occurred while fetching remote data');
  requestCounter.add(1, { path: '/remote', status: '500' });
  }
});

app.get('/liveness', (req, res) => {
  logger.info('Request to /liveness');
  res.send('Live');
  requestCounter.add(1, { path: '/liveness', status: '200' });
});

app.get('/readiness', (req, res) => {
  logger.info('Request to /readiness');
  setTimeout(() => {
    res.send('Ready');
  requestCounter.add(1, { path: '/readiness', status: '200' });
  }, READIENESS_DELAY);
});

export default app;
