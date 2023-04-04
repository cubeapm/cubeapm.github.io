---
title: OpenTelemetry Nodejs | Tutorial with a sample Nodejs app instrumentation
date: 2023-04-01
categories: [Auto-instrumentation, Nodejs]
tags: [nodejs, autoinstrumentation] # TAG names should always be lowercase
---

OpenTelemetry can auto-instrument many common modules for a Javascript application. The telemetry data captured can then be sent to CubeApm for analysis and visualization.

## Creating sample Nodejs application[​](#creating-sample-nodejs-application "Direct link to Creating sample Nodejs application")

You need to ensure that you have **Node.js version 12 or newer**. You can download the latest version of Node.js [here](https://nodejs.org/en/download/). For the sample application, let's create a basic 'hello world' express.js application.

<!-- If you do not want to follow these steps manually, you can directly check out the [GitHub repo](https://github.com/CubeApm/sample-nodejs-app) of the sample application. You can run the app directly after cloning it and start sending data to CubeApm. The code is already instrumented with OpenTelemetry libraries. -->

<!-- But, it would be better if you follow these steps to understand what's happening. -->

Check if node is installed on your machine by using the below command:

    node -v

Steps to get the app set up and running:

1.  **Make a directory and install express**  
    Make a directory for your sample app on your machine. Then open up the terminal, navigate to the directory path and install express with the following command:

        npm i express

2.  **Create index.js**  
     Create a file called `index.js` in your directory and with any text editor setup your 'Hello World' file with the code below:

    ```javascript
    const express = require("express");

    const cors = require("cors");
    const PORT = process.env.PORT || "5555";
    const app = express();
    app.use(cors());
    app.use(express.json());

    app.all("/", (req, res) => {
      res.json({ method: req.method, message: "Hello World", ...req.body });
    });

    app.get("/404", (req, res) => {
      res.sendStatus(404);
    });

    app.listen(parseInt(PORT, 10), () => {
      console.log(`Listening for requests on http://localhost:${PORT}`);
    });
    ```

3.  **Check if your application is working**
    Run your application by using the below command at your terminal.

        node index.js

    You can check if your app is working by visiting: [http://localhost:5555/](http://localhost:5555/)

    Once you are finished checking, exit the application by using `Ctrl + C` on your terminal.

## Set up OpenTelemetry and send data to CubeApm[​](#set-up-opentelemetry-and-send-data-to-signoz "Direct link to Set up OpenTelemetry and send data to CubeApm")

1.  **Install OpenTelemetry packages**
    You will need the following OpenTelemetry packages for this sample application.

        npm install --save @opentelemetry/sdk-nodenpm install --save @opentelemetry/auto-instrumentations-nodenpm install --save @opentelemetry/exporter-trace-otlp-http

    The dependencies included are briefly explained below:

    `@opentelemetry/sdk-node` - This package provides the full OpenTelemetry SDK for Node.js including tracing and metrics.

    `@opentelemetry/auto-instrumentations-node` - This module provides a simple way to initialize multiple Node instrumentations.

    `@opentelemetry/exporter-trace-otlp-http` - This module provides the exporter to be used with OTLP (`http/json`) compatible receivers.

2.  **Create `tracing.js` file**
    Instantiate tracing by creating a `tracing.js` file and using the below code.

    ```javascript
    const express = require("express");
    const cors = require("cors");
    const PORT = process.env.PORT || "5555";
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.all("/", (req, res) => {
      res.json({ method: req.method, message: "Hello World", ...req.body });
    });

    app.get("/404", (req, res) => {
      res.sendStatus(404);
    });

    app.listen(parseInt(PORT, 10), () => {
      console.log(`Listening for requests on http://localhost:${PORT}`);
    });
    ```

OpenTelemetry Node SDK currently does not detect the `OTEL_RESOURCE_ATTRIBUTES` from `.env` files as of today. That’s why we need to include the variables in the `tracing.js` file itself.

About environment variables:

`service_name`: name of the service you want to monitor

`environment`: dev, prod, staging, etc.

`http://localhost:4318/v1/traces` is the default url for sending your tracing data. We are assuming you have installed CubeApm on your `localhost`. Based on your environment, you can update it accordingly. It should be in the following format:

`http://<IP of CubeApm backend>:4318/v1/traces`

**Note**

Remember to allow incoming requests to port 4318 of machine where CubeApm backend is hosted.

3.  **Run your application**
    Now when you run your application, OpenTelemetry captures telemetry data from it and send it to CubeApm.

        node -r ./tracing.js index.js

You can check your application running at [http://localhost:5555/](http://localhost:5555/). You need to generate some load in order to see data reported on CubeApm dashboard. Refresh the endpoint for 10-20 times, and wait for 2-3 mins.

And, congratulations! You have instrumented your sample Node.js app. You can now access the CubeApm dashboard at [http://localhost:3301](http://localhost:3301) to monitor your app for performance metrics.

<!-- _Sample_app in the list of applications monitored_ -->

## Metrics, Traces and Logs of the Nodejs application[​](#metrics-traces-and-logs-of-the-nodejs-application "Direct link to Metrics, Traces and Logs of the Nodejs application")

CubeApm makes it easy to visualize metrics and traces captured through OpenTelemetry instrumentation.

CubeApm comes with out of box RED metrics charts and visualization. RED metrics stands for:

- Rate of requests
- Error rate of requests
- Duration taken by requests

_Measure things like application latency, requests per sec, error percentage and see your top endpoints_

You can then choose a particular timestamp where latency is high to drill down to traces around that timestamp.

<!-- _View of traces at a particular timestamp_ -->
<!-- TODO - Confirm with Vijay -->
<!-- You can use flamegraphs to exactly identify the issue causing the latency.

_Flamegraphs showing exact duration taken by each spans - a concept of distributed tracing_

You can also use CubeApm for log management. For Nodejs applications, you can use the [winston logger](https://signoz.io/blog/winston-logger/) to send logs to CubeApm.

_Logs management in CubeApm_ -->

## Conclusion[​](#conclusion "Direct link to Conclusion")

OpenTelemetry makes it very convenient to instrument your Nodejs application. You can then use an APM tool like CubeApm to analyze the performance of your app. As CubeApm offers a full-stack observability tool, you don't have to use multiple tools for your monitoring needs.
