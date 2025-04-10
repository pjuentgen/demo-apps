import { createLogger, format, transports } from 'winston';
import { trace } from '@opentelemetry/api';

const addTraceIds = format((info) => {
  const currentSpan = trace.getActiveSpan();
  if (currentSpan) {
    const spanContext = currentSpan.spanContext();
    info.traceId = spanContext.traceId;
    info.spanId = spanContext.spanId;
  }
  return info;
});

export const logger = createLogger({
  format: format.combine(
    addTraceIds(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, traceId, spanId }) => {
      return `${timestamp} [${level}] traceId=${traceId} spanId=${spanId} ${message}`;
    })
  ),
  transports: [
    new transports.Console(), // Logs to the console
    // Add other transports like File if needed
  ],
});