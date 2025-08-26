"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_node_1 = require("@opentelemetry/sdk-node");
const auto_instrumentations_node_1 = require("@opentelemetry/auto-instrumentations-node");
const api_1 = require("@opentelemetry/api");
const exporter_metrics_otlp_http_1 = require("@opentelemetry/exporter-metrics-otlp-http");
const exporter_trace_otlp_http_1 = require("@opentelemetry/exporter-trace-otlp-http");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const axios_1 = __importDefault(require("axios"));
const express_1 = __importDefault(require("express"));
const logger_1 = require("./logger");
// Configure OTLP metric exporter and SDK (metrics exported to OTLP endpoint)
const metricExporter = new exporter_metrics_otlp_http_1.OTLPMetricExporter();
const metricReader = new sdk_metrics_1.PeriodicExportingMetricReader({ exporter: metricExporter });
// Trace exporter (uses OTEL_EXPORTER_OTLP_ENDPOINT if set)
const traceExporter = new exporter_trace_otlp_http_1.OTLPTraceExporter();
const sdk = new sdk_node_1.NodeSDK({
    instrumentations: [(0, auto_instrumentations_node_1.getNodeAutoInstrumentations)()],
    traceExporter,
    metricReader: metricReader,
});
try {
    sdk.start();
}
catch (err) {
    logger_1.logger.error(`OpenTelemetry SDK failed to start: ${String(err)}`);
}
// Create OTEL Meter and Counter
const meter = api_1.metrics.getMeter('node-instrumented-app');
const requestCounter = meter.createCounter('app_requests_total', {
    description: 'Total number of requests',
});
const app = (0, express_1.default)();
const TIME = parseInt(process.env.TIME || '500');
const TIME_FOR_ERROR = parseInt(process.env.TIME_FOR_ERROR || '500');
const READIENESS_DELAY = parseInt(process.env.TIME_FOR_ERROR || '0');
const REMOTE_URL = process.env.REMOTE_URL || 'https://api.chucknorris.io/jokes/random';
app.get('/', (req, res) => {
    logger_1.logger.info('Request to /');
    const randomTime = Math.floor(Math.random() * TIME);
    setTimeout(() => {
        if (randomTime > 300) {
            res.status(500).send('Error occured');
            logger_1.logger.error('Error occured');
        }
        else {
            res.send('Hello World!');
        }
    }, randomTime);
});
app.get('/random-error', (req, res) => {
    logger_1.logger.info('Request to /random-error');
    const randomTime = Math.floor(Math.random() * TIME);
    setTimeout(() => {
        if (randomTime > TIME_FOR_ERROR) {
            res.status(500).send('Error occured');
            logger_1.logger.error('Error occured');
            requestCounter.add(1, { path: '/random-error', status: '500' });
        }
        else {
            res.send('Hello World!');
            requestCounter.add(1, { path: '/random-error', status: '200' });
        }
    }, randomTime);
});
app.get('/bad', (req, res) => {
    logger_1.logger.info('Request to /bad');
    res.status(500).send('Error occured');
    logger_1.logger.error('Error occured');
    requestCounter.add(1, { path: '/bad', status: '500' });
});
app.get('/healthy', (req, res) => {
    logger_1.logger.info('Request to /healthy');
    res.send('Hello World!');
    requestCounter.add(1, { path: '/healthy', status: '200' });
});
app.get('/remote', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('Request to /remote');
    logger_1.logger.info('Connecting to ' + REMOTE_URL);
    try {
        const response = yield axios_1.default.get(REMOTE_URL);
        const body = response.data;
        res.send(body);
        requestCounter.add(1, { path: '/remote', status: '200' });
    }
    catch (error) {
        logger_1.logger.error(`Error occurred while fetching remote data: ${(error === null || error === void 0 ? void 0 : error.message) || error}`);
        res.status(500).send('Error occurred while fetching remote data');
        requestCounter.add(1, { path: '/remote', status: '500' });
    }
}));
app.get('/liveness', (req, res) => {
    logger_1.logger.info('Request to /liveness');
    res.send('Live');
    requestCounter.add(1, { path: '/liveness', status: '200' });
});
app.get('/readiness', (req, res) => {
    logger_1.logger.info('Request to /readiness');
    setTimeout(() => {
        res.send('Ready');
        requestCounter.add(1, { path: '/readiness', status: '200' });
    }, READIENESS_DELAY);
});
exports.default = app;
