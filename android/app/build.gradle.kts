
import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    // Load Dash0 API credentials from dash0.env
    val dash0EnvFile = rootProject.file("dash0.env")
    if (dash0EnvFile.exists()) {
        val dash0Props = Properties()
        dash0EnvFile.inputStream().use { dash0Props.load(it) }
        val dash0Token = dash0Props.getProperty("DASH0_API_TOKEN", "")
        val dash0Endpoint = dash0Props.getProperty("DASH0_API_ENDPOINT", "")
        buildTypes.all {
            buildConfigField("String", "DASH0_API_TOKEN", '"' + dash0Token + '"')
            buildConfigField("String", "DASH0_API_ENDPOINT", '"' + dash0Endpoint + '"')
        }
    } else {
        buildTypes.all {
            buildConfigField("String", "DASH0_API_TOKEN", "\"\"")
            buildConfigField("String", "DASH0_API_ENDPOINT", "\"\"")
        }
    }
    namespace = "com.example.chucknorrisjokes"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.chucknorrisjokes"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
    }
    buildFeatures {
        buildConfig = true
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.10.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    implementation("com.squareup.okhttp3:okhttp:4.11.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // OpenTelemetry
    implementation("io.opentelemetry:opentelemetry-api:1.32.0")
    implementation("io.opentelemetry:opentelemetry-sdk:1.32.0")
    implementation("io.opentelemetry:opentelemetry-exporter-otlp:1.32.0")
    implementation("io.opentelemetry:opentelemetry-extension-kotlin:1.32.0")
    implementation("io.opentelemetry.instrumentation:opentelemetry-okhttp-3.0:1.32.0-alpha")
}