---
title: OpenTelemetry Python | Tutorial with a sample Python app instrumentation
date: 2023-04-01
categories: [Auto-instrumentation, Python]
tags: [python, autoinstrumentation] # TAG names should always be lowercase
---

OpenTelemetry is a vendor-agnostic instrumentation library under CNCF. It can be used to instrument your Python applications to generate telemetry data. Let's learn how it works and see how to visualize that data with CubeApm.

## What is OpenTelemetry?[​](#what-is-opentelemetry "Direct link to What is OpenTelemetry?")

OpenTelemetry emerged as a single project after the merging of OpenCensus(from Google) and OpenTracing(from Uber) into a single project. The project aims to make telemetry data(logs, metrics, and traces) a built-in feature of cloud-native software applications.

OpenTelemetry has laguage-specific implementation for generating telemetry data which includes OpenTelemetry Python libraries.

You can check out the current releases of [opentelemetry-python](https://github.com/open-telemetry/opentelemetry-python/releases).

OpenTelemetry only generates telemetry data and lets you decide where to send your data for analysis and visualization. In this article, we will be using [CubeApm](https://CubeApm.io/) - an open-source full-stack application performance monitoring tool as our analysis backend.

**Steps to get started with OpenTelemetry for a Python application:**

- Installing CubeApm
- Installing sample Python app
- Instrumentation with OpenTelemetry and sending data to CubeApm

## Installing CubeApm[​](#installing-CubeApm "Direct link to Installing CubeApm")

You can get started with CubeApm using just three commands at your terminal.

    git clone -b main https://github.com/CubeApm/CubeApm.git
    cd CubeApm/deploy/
    ./install.sh

For detailed instructions, you can visit our documentation.

When you are done installing CubeApm, you can access the UI at: `http://localhost:3301`

<!-- The application list shown in the dashboard is from a sample app called HOT R.O.D that comes bundled with the CubeApm installation package.

_CubeApm dashboard_ -->

## Installing sample Python app[​](#installing-sample-python-app "Direct link to Installing sample Python app")

**Prerequisites**

1.  **Python 3.4 or newer**  
    If you do not have Python installed on your system, you can download it from the [link](https://www.python.org/downloads/). Check the version of Python using `python3 --version` on your terminal to see if Python is properly installed or not.
2.  **MongoDB**  
     If you already have MongoDB services running on your system, you can skip this step.

    For macOS: [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

    For Linux: [https://docs.mongodb.com/manual/administration/install-on-linux/](https://docs.mongodb.com/manual/administration/install-on-linux/)

    For Ubuntu: [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

    For Windows: [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

    On MacOS the installation is done using Homebrew's brew package manager. Once the installation is done, don't forget to start MongoDB services using `brew services start mongodb/brew/mongodb-community@4.4`  on your macOS terminal.

<!-- _starting mongoDB services from mac terminal_ -->

<!--

### Steps to get the Python app up and running[​](#steps-to-get-the-python-app-up-and-running "Direct link to Steps to get the Python app up and running")

1.  Clone sample Flask app repository and go to the root folder

        git clone https://github.com/CubeApm/sample-flask-app.git
        cd sample-flask-app

2.  Check if the app is running

        python3 app.py

_mac terminal commands for running a python app_

You can now access the UI of the app on your local host: http://localhost:5002/

_Python app UI_ -->

## Instrumentation with OpenTelemetry and sending data to CubeApm[​](#instrumentation-with-opentelemetry-and-sending-data-to-CubeApm "Direct link to Instrumentation with OpenTelemetry and sending data to CubeApm")

1.  **Opentelemetry Python instrumentation installation**  
    Your app folder contains a file called requirements.txt. This file contains all the necessary commands to set up OpenTelemetry Python instrumentation. All the mandatory packages required to start the instrumentation are installed with the help of this file. Make sure your path is updated to the root directory of your sample app and run the following command:

        pip3 install -r requirements.txt

    If it hangs while installing `grpcio` during **pip3 install opentelemetry-exporter-otlp** then follow below steps as suggested in [this stackoverflow link](https://stackoverflow.com/questions/56357794/unable-to-install-grpcio-using-pip-install-grpcio/62500932#62500932).

    - pip3 install --upgrade pip
    - python3 -m pip install --upgrade setuptools
    - pip3 install --no-cache-dir --force-reinstall -Iv grpcio

2.  **Install application specific packages**  
    This step is required to install packages specific to the application. Make sure to run this command in the root directory of your installed application. This command figures out which instrumentation packages the user might want to install and installs it for them:

        opentelemetry-bootstrap --action=install

3.  **Configure a span exporter and run your application**  
    You're almost done. In the last step, you just need to configure a few environment variables for your OTLP exporters. Environment variables that need to be configured:

    - `service.name`\- application service name (you can name it as you like)
    - `OTEL_EXPORTER_OTLP_ENDPOINT` - In this case, IP of the machine where CubeApm is installed

    You need to put these environment variables in the below command.

    **Note**

    Don’t run app in reloader/hot-reload mode as it breaks instrumentation.

        OTEL_RESOURCE_ATTRIBUTES=service.name=<service_name> OTEL_EXPORTER_OTLP_ENDPOINT="http://<IP of CubeApm>:4317"

        opentelemetry-instrument python3 app.py

    As we are running CubeApm on local host, `IP of CubeApm` can be replaced with `localhost` in this case. And, for `service_name` let's use `pythonApp`. Hence, the final command becomes:

    **Final Command**

        OTEL_RESOURCE_ATTRIBUTES=service.name=pythonApp OTEL_EXPORTER_OTLP_ENDPOINT="http://localhost:4317"

        opentelemetry-instrument python3 app.py

    And, congratulations! You have instrumented your sample Python app. You can now access the CubeApm dashboard at [http://localhost:3301](http://localhost:3301/) to monitor your app for performance metrics.

<!-- _CubeApm dashboard showing python app in its list of applications_ -->

## Metrics and Traces of the Python application[​](#metrics-and-traces-of-the-python-application "Direct link to Metrics and Traces of the Python application")

CubeApm makes it easy to visualize metrics and traces captured through OpenTelemetry instrumentation.

CubeApm comes with out of box RED metrics charts and visualization. RED metrics stands for:

- Rate of requests
- Error rate of requests
- Duration taken by requests

<!-- _CubeApm dashboard showing the popular RED metrics for application performance monitoring_ -->

You can then choose a particular timestamp where latency is high to drill down to traces around that timestamp.

<!-- _View of traces at a particular timestamp_

You can use flamegraphs to exactly identify the issue causing the latency.

_Flamegraphs showing exact duration taken by each spans - a concept of distributed tracing_ -->

## Conclusion[​](#conclusion "Direct link to Conclusion")

OpenTelemetry makes it very convenient to instrument your Python application. You can then use an APM tool like CubeApm to analyze the performance of your app. As CubeApm offers a full-stack observability tool, you don't have to use multiple tools for your monitoring needs.
