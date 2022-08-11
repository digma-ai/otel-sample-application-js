# otel-sample-application-js
opentelemetry sample application - javscript

```
#!/bin/bash

export PGPASSWORD='postgres'; psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "postgres" -h localhost<<-EOSQL
    CREATE DATABASE users;
EOSQL

export PGPASSWORD='postgres'; psql -v ON_ERROR_STOP=1 --username "postgres" --dbname "users" -h localhost<<-EOSQL
   create table users (
  id VARCHAR(128) primary key,
  name VARCHAR(512) not null
);
EOSQL

```

```
npm i  --save pg
npm i --save @opentelemetry/auto-instrumentations-node
npm i --save @opentelemetry/exporter-trace-otlp-proto
npm i --save @opentelemetry/sdk-node
npm i --save @opentelemetry/exporter-jaeger
npm i --save express
npm i --save config

npm i --save find-package-json
npm i --save @opentelemetry/exporter-trace-otlp-grpc

```