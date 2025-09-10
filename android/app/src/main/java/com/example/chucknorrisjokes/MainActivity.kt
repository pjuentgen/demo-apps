package com.example.chucknorrisjokes

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import io.opentelemetry.context.Context as OtelContext
import io.opentelemetry.extension.kotlin.asContextElement
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONObject
import io.opentelemetry.instrumentation.okhttp.v3_0.OkHttpTelemetry
import io.opentelemetry.api.trace.Span
import io.opentelemetry.api.trace.StatusCode
import io.opentelemetry.context.Scope
import io.opentelemetry.context.Context

class MainActivity : AppCompatActivity() {
    
    private lateinit var jokeTextView: TextView
    private lateinit var getJokeButton: Button
    private lateinit var activitySpan: Span
    
    private val httpClient: okhttp3.Call.Factory by lazy {
        val baseClient = OkHttpClient.Builder().build()
        val telemetry = OkHttpTelemetry.builder(io.opentelemetry.api.GlobalOpenTelemetry.get()).build()
        telemetry.newCallFactory(baseClient)
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        TelemetryConfig.initialize()
        val tracer = TelemetryConfig.getTracer()
        activitySpan = tracer.spanBuilder("activity_started")
            .setAttribute("activity", "MainActivity")
            .startSpan()
        
        activitySpan.makeCurrent().use { _ ->
            try {
                setContentView(R.layout.activity_main)
                
                jokeTextView = findViewById(R.id.jokeTextView)
                getJokeButton = findViewById(R.id.getJokeButton)
                
                getJokeButton.setOnClickListener {
                    fetchJoke()
                }
                
                fetchJoke()
                activitySpan.setStatus(StatusCode.OK)
            } catch (e: Exception) {
                activitySpan.setStatus(StatusCode.ERROR, "Activity creation failed")
            }
        }
    }
    
    private fun fetchJoke() {
        val tracer = TelemetryConfig.getTracer()
        val span = tracer.spanBuilder("button_clicked")
            .setAttribute("action", "fetch_joke")
            .startSpan()
        
        span.makeCurrent().use { _ ->
            try {
                getJokeButton.isEnabled = false
                jokeTextView.text = getString(R.string.loading)
                
                val currentContext = OtelContext.current()
                CoroutineScope(currentContext.asContextElement() + Dispatchers.IO).launch {
                    try {
                        val request = Request.Builder()
                            .url("https://api.chucknorris.io/jokes/random")
                            .build()
                        
                        val response = httpClient.newCall(request).execute()
                        val responseBody = response.body?.string()
                        
                        if (response.isSuccessful && responseBody != null) {
                            val jsonObject = JSONObject(responseBody)
                            val joke = jsonObject.getString("value")
                            
                            span.setStatus(StatusCode.OK)
                            
                            withContext(Dispatchers.Main) {
                                jokeTextView.text = joke
                                getJokeButton.isEnabled = true
                            }
                        } else {
                            span.setStatus(StatusCode.ERROR, "HTTP error")
                            
                            withContext(Dispatchers.Main) {
                                jokeTextView.text = "Failed to fetch joke. Please try again."
                                getJokeButton.isEnabled = true
                            }
                        }
                    } catch (e: Exception) {
                        span.setStatus(StatusCode.ERROR, "Exception")
                        
                        withContext(Dispatchers.Main) {
                            jokeTextView.text = "Error: ${e.message}"
                            getJokeButton.isEnabled = true
                        }
                    } finally {
                        span.end()
                    }
                }
            } catch (e: Exception) {
                span.setStatus(StatusCode.ERROR, "Initialization failed")
                span.end()
                
                jokeTextView.text = "Error: ${e.message}"
                getJokeButton.isEnabled = true
            }
        }
    }
    
    override fun onDestroy() {
        super.onDestroy()
        if (::activitySpan.isInitialized) {
            activitySpan.end()
        }
    }
}