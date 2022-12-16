FROM postgres:14.5

COPY ./db.sql /docker-entrypoint-initdb.d/
