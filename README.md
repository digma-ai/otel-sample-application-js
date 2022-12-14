# OpenTelemetry Sample: Node.js-based APIs instrumented with OTEL and Digma

This repository contains a number of sample applications used to test various scenarios, performance bottlenecks and runtime errors with [Digma](https://github.com/digma-ai/digma). The samples use the standard OTEL instrumentation libraries as well as the [Digma instrumentation for JavaScript](https://github.com/digma-ai/otel-js-instrumentation) and [Digma instrumentation for Express](https://github.com/digma-ai/digma-instrumentation-express) helper packages.

The instructions on this page explain how to run the included `user-service` app.

## Running the app with Digma

Getting the app up and running with Digma has three stages:

1. Download and run the [Digma backend](https://github.com/digma-ai/digma).
2. Install the IDE extension.
3. Run the app and check out the insights.

## Install the IDE extension

1. Install the [Digma Extension](https://marketplace.visualstudio.com/items?itemName=digma.digma) in the VS Code IDE.
2. Open the 'Settings' tab of the extension.

    ![image](https://user-images.githubusercontent.com/93863/165008075-96fa40cd-a566-4c69-9481-195f69f3c425.png)

3. Set the 'Digma URL' to your Digma Account URL on the User/Workspace level. Leave the port as 5051.

    ![image](https://user-images.githubusercontent.com/93863/165008209-c832fc43-0600-48e9-9324-a5c9f8e4b904.png)

## Two Options

There are two ways to run the app.
* **Using Docker Compose.** This is the easier option and will get you up and running faster. It will prepare the database and launch the app with just a couple of commands.
* **Manually.** This is the more advanced option and requires you to manually prepare your local environment and launch the app.

You can find the instructions for both options on this page.
But first, let's install the Digma extension.

## Option 1: Run the app using Docker Compose

1. Clone this repo:

    ```sh
    git clone https://github.com/digma-ai/otel-sample-application-js.git
    ```

2. Run Docker Compose:

    ```sh
    cd otel-sample-application-js/src/user-service
    docker compose up
    ```

## Option 2: Run the app manually

The app requires an operational Digma backend. If you haven't already set up the backend, follow our [simple instructions](https://github.com/digma-ai/digma) to get it up and running quickly.

### Prerequisites
- [Node.js](https://nodejs.org/) 8 or above
- [VS Code](https://code.visualstudio.com/download)
- [PostgreSQL](https://www.postgresql.org/download/)

### Prepare the Node.js app environment

1. Clone this repo:

    ```sh
    git clone https://github.com/digma-ai/otel-sample-application-js.git
    ```

2. Install all the dependencies for the app:

    ```sh
    cd otel-sample-application-js/src/user-service
    npm install
    ```

3. Verify the `otel.endpoint` property is correctly configured in **src/user-uservice/config/default.json**. Replace `localhost` with the URL provided to your account in your own apps.

    ```json
    {
      "otel": {
        "endpoint": "http://localhost:5050"
      }
    }
    ```

4. Initialize the sample app database.

    Run the following commands at the bash command line to create the database.

    ```sh
    export PGPASSWORD='postgres'; psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" -h localhost<<-EOSQL
      CREATE DATABASE users;
      \connect users;
      CREATE TABLE users (
        id VARCHAR(128) primary key,
        name VARCHAR(512) not null
      );
    EOSQL
    ```

    Note that these commands assume you have a local instance named `postgres` with a user whose username and password are both `postgres` as well.
    Modify the commands appropriately to connect to a database with different credentials.
    If you do change the credentials or the database name, don't forget to update the connection info in **src/user-service/handlers/queries.js**.

5. Run the app.

    ```sh
    npm run develop
    ```

    Alternatively, you can run the app with the debugger in VS Code by selecting the (default) "Launch user service" launch configuration and running the debugger (typically `F5`).

## Use the app

Play around with the **user-service** app and call some of the API urls.
You can find a helpful list of prepared HTTP requests in the [src/user-service/requests.http](src/user-service/requests.http) file.

We recommend installing the [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) (`humao.rest-client`) VS Code extension, which helps you call the urls in that file (including POST requests) and display their results directly in VS Code. You can also use [Postman](https://www.postman.com/downloads/) or other similar tools to call the urls.

## Troubleshooting

If you've encountered any issue, open the 'output' panel for the digma extension. It may contain more useful information about the issue:

![image](https://user-images.githubusercontent.com/93863/165012583-9d154ea5-7378-466b-a6cc-686d4b5261e3.png)
