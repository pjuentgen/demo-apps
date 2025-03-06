import logging
import os
import json
from opentelemetry import trace
from opentelemetry._logs import set_logger_provider
from opentelemetry.exporter.otlp.proto.grpc._log_exporter import (
    OTLPLogExporter,
)
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from opentelemetry.sdk.resources import Resource
from aiohttp import web

resource = Resource.create(
        {
            "service.name": "demo-service",
            "service.namespace": "demo-namespace",           
        }
    )

logger_provider = LoggerProvider(resource=resource)
set_logger_provider(logger_provider)
exporter = OTLPLogExporter(endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317"), headers={'authorization' : "Bearer "+os.getenv("DASH0_AUTHORIZATION_TOKEN")})
logger_provider.add_log_record_processor(BatchLogRecordProcessor(exporter))
handler = LoggingHandler(level=logging.DEBUG,logger_provider=logger_provider)
logger = logging.getLogger("myapp.area2")
logger.addHandler(handler)
logger.setLevel(logging.DEBUG)


async def handle(request):
    name = request.match_info.get('name', "Anonymous")
    logger.info("completed request")
    text = "Hello, " + name
    return web.Response(text=text)

app = web.Application()
app.add_routes([web.get('/', handle),
                web.get('/{name}', handle)])

if __name__ == '__main__':
    web.run_app(app)