CREATE DATABASE users;
\connect users;
CREATE TABLE users (
  id VARCHAR(128) primary key,
  name VARCHAR(512) not null
);
