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
