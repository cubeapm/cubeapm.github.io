---
title: OpenTelemetry Java | Tutorial with a sample Java app instrumentation
date: 2023-04-01
categories: [Auto-instrumentation, Java]
tags: [java, autoinstrumentation] # TAG names should always be lowercase
---

OpenTelemetry is a vendor-agnostic instrumentation library. In this article, let's explore how to auto-instrument a Tomcat Java application using OpenTelemetry Java JAR agent.

After capturing telemetry data with OpenTelemetry, we will use CubeApm, an open-source full-stack observability tool, to visualize the data.

Steps to get started with OpenTelemetry for Tomcat Java application:

- Installing CubeApm
- Installing sample Tomcat Java application
- Auto Instrumentation with OpenTelemetry Java agent
- Getting metrics and traces for Tomcat application in CubeApm

## Installing CubeApm[​](#installing-CubeApm "Direct link to Installing CubeApm")

You can get started with CubeApm using just three commands at your terminal.

    git clone -b main https://github.com/CubeApm/CubeApm.gitcd CubeApm/deploy/./install.sh

For detailed instructions, you can visit our documentation.

[![Deployment Docs](/assets/images/deploy_docker_documentation-bec1da231907864909603a1bf9062b90.webp)](https://CubeApm.io/docs/install/docker/?utm_source=blog&utm_medium=opentelemetry_tomcat)

We have installed CubeApm on a Ubuntu VM in Azure cloud. You can access CubeApm UI at `http://IP_of_CubeApm:3301`. You can access CubeApm UI at port: 3301 of any host that you choose. In case of local host just use: `http://localhost:3301`

The application list shown in the dashboard is from a sample app called HOT R.O.D that comes bundled with the CubeApm installation package.

![CubeApm dashboard showing application list](/img/blog/2021/08/openetelemetry_tomcat_CubeApm_dashboard.png)

CubeApm Dashboard

## Installing sample Tomcat Java application[​](#installing-sample-tomcat-java-application "Direct link to Installing sample Tomcat Java application")

**Prerequisites:**  
Make sure you have Tomcat installed on your system. If not, then you can download it from [Apache Tomcat website](https://tomcat.apache.org/index.html). For this tutorial I have used Tomcat 10.0.8.

### Steps to install sample Tomcat Java application:[​](#steps-to-install-sample-tomcat-java-application "Direct link to Steps to install sample Tomcat Java application:")

- Download an example app packaged as a war file provided at Apache Tomcat official website - [Sample Tomcat app](https://tomcat.apache.org/tomcat-7.0-doc/appdev/sample/) ![Sample applicationlink](/assets/images/opentelemetry_tomcat_sample_app-min-c88e0b06ffa827fd8dd3b50bf0c016c3.png)
- The easiest way to run the sample app is to move it to webapps folder inside the Tomcat directory.

      cd Tomcat/webappscp ~/Downloads/sample.war .

- Once you have copied the file in the webapps folder, get back to the Tomcat folder and run the app using the following command.

      cd ..bin/startup.sh

- Check if the sample app is running at: http://localhost:8080/sample/ . The sample should open up like below.

  ![Sample app running](/assets/images/opentelemetry_tomcat_sample_app-min-c88e0b06ffa827fd8dd3b50bf0c016c3.png)

  By clicking on the links shown on the page, you can see that it makes dummy calls to a page as part of the Hello World application.

## Auto Instrumentation with OpenTelemetry Java agent[​](#auto-instrumentation-with-opentelemetry-java-agent "Direct link to Auto Instrumentation with OpenTelemetry Java agent")

OpenTelemetry has a very handy Java JAR agent that can be attached to any Java 8+ application for instrumenting Java applications.. The JAR agent can detect a number of popular libraries and frameworks and instrument it right out of the box. You don't need to add any code for that.

1.  Download the [latest Java JAR agent](https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar).
2.  For the Tomcat application, you need to setup a few environment variables. You need to create and add a new file `setenv.sh` in your Tomcat bin folder. The `./startup.sh` command which is used to run the Java app will check for `setenv.sh` file and run the commands accordingly.
3.  In `setenv.sh` file, paste the following environment variables using a code editor:

        export CATALINA_OPTS="$CATALINA_OPTS -javaagent:/path/opentelemetry-javaagent.jar"export OTEL_EXPORTER_OTLP_ENDPOINT=<IP of CubeApm Backend>:4317export OTEL_RESOURCE_ATTRIBUTES=service.name=<app_name>

    In the `CATALINA_OPTS` environment variable, you need to replace `path` with the path of the folder location where you have saved the OpenTelemetry Java agent downloaded in step 1.

    The `OTEL_EXPORTER_OTLP_ENDPOINT` specifies the endpoint for CubeApm's backend. In place of IP of CubeApm backend, you need to put the IP of host machine where CubeApm is installed. Also, remember to allow incoming requests to port 4317 of the machine where CubeApm backend is hosted.

    `OTEL_RESOURCE_ATTRIBUTES` is used to specify the service name of the service being monitored. So the final environment variables will look like below. Note that:

        export CATALINA_OPTS="$CATALINA_OPTS -javaagent:/Users/cruxaki/Downloads/opentelemetry-javaagent.jar"export OTEL_EXPORTER_OTLP_ENDPOINT=http://40.76.59.122:4317export OTEL_RESOURCE_ATTRIBUTES=service.name=Tomcat-CubeApm

    Make sure that you have saved this file as `setenv.sh` and in your Tomcat bin folder, because when starting up, Catalina checks this file for environment variables.

4.  Now we need to restart our Tomcat Java app with the OpenTelemetry Java agent attached to it. Make sure you're at your Tomcat home folder and then restart the Tomcat server using following commands:

        bin/shutdown.shbin/startup.sh

    Check out the sample Tomcat app again at  [http://localhost:8080/sample/](http://localhost:8080/sample/) and play around with it to generate some load. It might take 1-2 minutes before it starts showing up in the CubeApm dashboard.

    Below you can find your `Tomcat-CubeApm` app in the list of applications being monitored.

    ![Tomcat shows up in the list of applications monitored by CubeApm](/img/blog/2021/08/opentelemetry_tomcat_ui.png)

    Tomcat-CubeApm shows up in the list of applications monitored by CubeApm

## Metrics and Traces of the Tomcat Java Application[​](#metrics-and-traces-of-the-tomcat-java-application "Direct link to Metrics and Traces of the Tomcat Java Application")

CubeApm makes it easy to visualize metrics and traces captured through OpenTelemetry instrumentation.

CubeApm comes with out of box RED metrics charts and visualization. RED metrics stands for:

- Rate of requests
- Error rate of requests
- Duration taken by requests

![CubeApm UI showing charts](/img/blog/2021/08/opentelemetry_tomcat_CubeApm_charts.png)

CubeApm UI showing popular RED metrics of application performance

You can then choose a particular timestamp where latency is high to drill down to traces around that timestamp.

![View of traces at a particular timestamp](/img/blog/2021/08/opentelemetry_regex.png)

View of traces at a particular timestamp

You can use flamegraphs to identify the issue causing the latency.

![Flamegraphs](/img/blog/2021/08/opentelemetry_tomcat_flamegraphs.png)

Flamegraphs used for distributed tracing in CubeApm dashboard

## Conclusion[​](#conclusion "Direct link to Conclusion")

OpenTelemetry makes it very convenient to instrument your Spring Boot application. You can then use an open-source APM tool like CubeApm to analyze the performance of your app. As CubeApm offers a full-stack observability tool, you don't have to use multiple tools for your monitoring needs.
