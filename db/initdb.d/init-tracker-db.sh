#!/usr/bin/env bash

set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE tracker_db ENCODING UTF8' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'tracker_db')\gexec;
    CREATE USER testUser WITH PASSWORD 'password123';
    GRANT ALL PRIVILEGES ON DATABASE tracker_db TO testUser;
    ALTER USER testUser WITH SUPERUSER;
EOSQL