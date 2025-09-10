package com.example.chucknorrisjokes

import io.opentelemetry.api.GlobalOpenTelemetry
import io.opentelemetry.api.trace.Tracer
import io.opentelemetry.exporter.otlp.http.trace.OtlpHttpSpanExporter
import io.opentelemetry.sdk.OpenTelemetrySdk
import io.opentelemetry.sdk.trace.SdkTracerProvider
import io.opentelemetry.sdk.trace.export.BatchSpanProcessor
import com.example.chucknorrisjokes.BuildConfig

object TelemetryConfig {
    
    private var isInitialized = false
    
    fun initialize() {
        if (isInitialized) return

        val endpoint = BuildConfig.DASH0_API_ENDPOINT
        val token = BuildConfig.DASH0_API_TOKEN

        val spanExporter = OtlpHttpSpanExporter.builder()
            .setEndpoint(endpoint)
            .addHeader("Authorization", "Bearer $token")
            .build()

        val tracerProvider = SdkTracerProvider.builder()
            .addSpanProcessor(BatchSpanProcessor.builder(spanExporter).build())
            .build()

        val openTelemetry = OpenTelemetrySdk.builder()
            .setTracerProvider(tracerProvider)
            .build()

        GlobalOpenTelemetry.set(openTelemetry)
        isInitialized = true
    }
    
    fun getTracer(): Tracer {
        return GlobalOpenTelemetry.getTracer("chuck-norris-app", "1.0.0")
    }
}