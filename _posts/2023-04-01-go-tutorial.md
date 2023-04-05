---
title: Test OpenTelemetry Golang | Tutorial with a sample Go app instrumentation
date: 2023-04-01
categories: [Auto-instrumentation, Go]
tags: [go, autoinstrumentation] # TAG names should always be lowercase
---

Test OpenTelemetry can be used to generate telemetry data from your Go applications. The collected data can then be sent to an observability tool for storage and visualization. OpenTelemetry is an open-source project under the Cloud Native Computing Foundation ([CNCF](https://www.cncf.io/)) that aims to standardize the generation and collection of telemetry data.

In this tutorial, we will use OpenTelemetry Go libraries to instrument a Go application and then visualize it using an observability tool - [CubeApm](https://CubeApm.io/).

Steps to get started with OpenTelemetry for Go applications:

- [Installing CubeApm](#installing-CubeApm)
- [Instrumenting a Go application with OpenTelemetry](#instrumenting-a-go-application-with-opentelemetry)
- [Adding custom attributes and custom events to spans](#adding-custom-attributes-and-custom-events-to-spans)
- [Monitoring your Go application with CubeApm dashboards](#monitor-your-go-application-with-CubeApm-dashboards)

## Installing CubeApm[​](#installing-CubeApm "Direct link to Installing CubeApm")

First, you need to install CubeApm so that OpenTelemetry can send the data to it.

CubeApm can be installed on macOS or Linux machines in just three steps by using a simple install script.

    git clone -b main https://github.com/CubeApm/CubeApm.git
    cd CubeApm/deploy/
    ./install.sh

When you are done installing CubeApm, you can access the UI at [http://localhost:3301](http://localhost:3301/application)

<!-- _CubeApm dashboard - It shows services from a sample app that comes bundled with the application_ -->

## Instrumenting a Go application with OpenTelemetry[​](#instrumenting-a-go-application-with-opentelemetry "Direct link to Instrumenting a Go application with OpenTelemetry")

**Step 1: Install dependencies**

Dependencies related to OpenTelemetry exporter and SDK have to be installed first. Run the below commands after navigating to the application source folder:

```go
go get go.opentelemetry.io/otel
go.opentelemetry.io/otel/trace
go.opentelemetry.io/otel/sdk
go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin
go.opentelemetry.io/otel/exporters/otlp/otlptrace
go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc
```

**Step 2: Declare environment variables for configuring OpenTelemetry**

Declare the following variables in `main.go` which we will use to configure OpenTelemetry:

```go
var (
    serviceName  = os.Getenv("SERVICE_NAME")
    collectorURL = os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT")
    insecure     = os.Getenv("INSECURE_MODE")
)
```

**Step 3: Instrument your Go application with OpenTelemetry**

To configure your application to send data we will need a function to initialize OpenTelemetry. Add the following snippet of code in your `main.go` file.

```go
import (
    "github.com/gin-gonic/gin"
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace"
    "go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracegrpc"

    "go.opentelemetry.io/otel/sdk/resource"
    sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

func initTracer() func(context.Context) error {


    secureOption := otlptracegrpc.WithTLSCredentials(credentials.NewClientTLSFromCert(nil, ""))
    if len(insecure) > 0 {
        secureOption = otlptracegrpc.WithInsecure()
    }

    exporter, err := otlptrace.New(
        context.Background(),
        otlptracegrpc.NewClient(
            secureOption,
            otlptracegrpc.WithEndpoint(collectorURL),
        ),
    )

    if err != nil {
        log.Fatal(err)
    }
    resources, err := resource.New(
        context.Background(),
        resource.WithAttributes(
            attribute.String("service.name", serviceName),
            attribute.String("library.language", "go"),
        ),
    )
    if err != nil {
        log.Printf("Could not set resources: ", err)
    }

    otel.SetTracerProvider(
        sdktrace.NewTracerProvider(
            sdktrace.WithSampler(sdktrace.AlwaysSample()),
            sdktrace.WithBatcher(exporter),
            sdktrace.WithResource(resources),
        ),
    )
    return exporter.Shutdown
}
```

**Step 4: Initialize the tracer in main.go**

Modify the main function to initialise the tracer in `main.go`

```go
func main() {
    cleanup := initTracer()
    defer cleanup(context.Background())

    ......
}
```

**Step 5: Add the OpenTelemetry Gin middleware**

Configure Gin to use the middleware by adding the following lines in `main.go`.

```go
import (
    ....
  "go.opentelemetry.io/contrib/instrumentation/github.com/gin-gonic/gin/otelgin"
)

func main() {
    ......
    r := gin.Default()
    r.Use(otelgin.Middleware(serviceName))
    ......
}

```

**Step 6: Set environment variables and run your Go Gin application**

Now that you have instrumented your Go Gin application with OpenTelemetry, you need to set some environment variables to send data to CubeApm backend:

`SERVICE_NAME`: goGinApp (you can name it whatever you want)

`OTEL_EXPORTER_OTLP_ENDPOINT`: localhost:4317

Since, we have installed CubeApm on our local machine, we use the above IP. If you install CubeApm on a different machine, you can update it with the relevant IP.

Hence, the final run command looks like this:

    SERVICE_NAME=goGinApp
    INSECURE_MODE=true
    OTEL_EXPORTER_OTLP_ENDPOINT=localhost:4317 go run main.go

And, congratulations! You have instrumented your sample Golang app.

<!-- Hit the `/books` endpoint of the bookstore app at [http://localhost:8090/books](http://localhost:8090/books). Refresh it a bunch of times in order to generate load, and wait for 1-2 mins for data to appear on CubeApm dashboard. -->

## Adding custom attributes and custom events to spans[​](#adding-custom-attributes-and-custom-events-to-spans "Direct link to Adding custom attributes and custom events to spans")

It’s also possible to set custom attributes or tags to a span. To add custom attributes and events follow the below steps:

**Step 1: Import trace and attribute libraries**

```go
import (
    ...
    "go.opentelemetry.io/otel/attribute"
    "go.opentelemetry.io/otel/trace"
)
```

**Step 2: Fetch current span from context**

```go
  span := trace.SpanFromContext(c.Request.Context())
```

**Step 3: Set attribute on current**

```go
  span.SetAttributes(attribute.String("controller", "books"))
```

<!-- CubeApm dashboards can be used to track these custom attributes. -->

<!-- ![Custom attributes on CubeApm dashboard](/img/blog/2022/05/opentelemetry_go_custom_attributes.webp) -->

<!-- TODO - Check with Vijay -->
<!-- _Custom attributes can seen under \`Tags\` section on CubeApm trace detail page_ -->

We can also set custom event on the span with it’s own attribute.

```go
span.AddEvent("This is a sample event", trace.WithAttributes(attribute.Int("pid", 4328), attribute.String("sampleAttribute", "Test")))
```

<!-- You can also see these custom events on CubeApm dashboard. -->

<!-- ![Custom Events on CubeApm Dashboard](/img/blog/2022/05/opentelemetry_go_events.webp) -->

<!-- TODO - Check with Vijay -->
<!-- _Events can be seen under \`Events\` section on CubeApm trace detail page_ -->

<!-- Events can be seen under `Events` section on CubeApm trace detail page -->

## Monitor your Go application with CubeApm dashboards[​](#monitor-your-go-application-with-CubeApm-dashboards "Direct link to Monitor your Go application with CubeApm dashboards")

With the above steps, you have instrumented your Go application with OpenTelemetry. OpenTelemetry sends the collected data to CubeApm which can be used to store it and visualize it. Let’s see how CubeApm can help you monitor your Go application.

You need to interact with your sample application a bit to generate some monitoring data. As mentioned earlier, hit the `/books` endpoint of the bookstore app at [http://localhost:8090/books](http://localhost:8090/books) and refresh it a bunch of times in order to generate load.

You can then navigate to [http://localhost:3301/application](http://localhost:3301/application) (needs signup) to see your Go app being monitored.

<!-- TODO - Check with Vijay -->
<!-- Go to `Metrics`→ `goGinApp`→ you will be able to see the dashboard. -->

<!-- _Your Go Gin application being monitored on the CubeApm dashboard_ -->

<!-- You can monitor application metrics like application latency, requests per second, error percentage, etc. with the `Metrics` tab of CubeApm.

_You can monitor your Go Gin application metrics like application latency, requests per second, error percentage, etc._ -->

OpenTelemetry captures tracing data from your Gin application as well. Tracing data can help you visualize how user requests perform across services in a multi-service application.

<!-- In the `Traces` tab of CubeApm, you can analyze the tracing data using filters based on tags, status codes, service names, operations, etc.

_Use powerful filters to analyze your tracing data from the Gin application_ -->

<!-- You can also visualize your tracing data with the help of flamegraphs and Gantt charts.

_Flamegraphs and Gantt charts on CubeApm dashboard_ -->

## Conclusion[​](#conclusion "Direct link to Conclusion")

Using OpenTelemetry libraries, you can instrument your Go applications for setting up observability. You can then use an APM tool like CubeApm to ensure the smooth performance of your Go applications.

OpenTelemetry is the future for setting up observability for cloud-native apps. It is backed by a huge community and covers a wide variety of technology and frameworks. Using OpenTelemetry, engineering teams can instrument polyglot and distributed applications with peace of mind.
