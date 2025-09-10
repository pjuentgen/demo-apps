# Chuck Norris Jokes Android App

A simple Android app that fetches Chuck Norris jokes using the Chuck Norris API.

## Features
- Fetches random Chuck Norris jokes from `https://api.chucknorris.io/jokes/random`
- Uses OkHttp for HTTP requests (supports OpenTelemetry tracing)
- Simple UI with joke display and refresh button
- Built with Kotlin and Coroutines

## Building
1. Open the project in Android Studio
2. Sync the project with Gradle files
3. Run the app on an emulator or device

## OpenTelemetry Support
The app uses OkHttp which can be easily instrumented with OpenTelemetry by adding the appropriate instrumentation library:

```kotlin
implementation("io.opentelemetry.instrumentation:opentelemetry-okhttp-3.0:1.31.0-alpha")
```

Then configure OpenTelemetry in your Application class to trace HTTP requests.

## API
Uses the public Chuck Norris API: https://api.chucknorris.io/