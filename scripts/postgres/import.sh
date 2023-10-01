#!/bin/bash
case "$1" in
    "prod")
        export $(cat .env | grep -v ^# | grep -v ^alias | xargs)
        ;;
    "dev")
        export $(cat .development.env | grep -v ^# | grep -v ^alias | xargs)
        ;;
    *)
        echo "Error: export.sh prod|dev ./path.sql"
        exit
esac

docker exec -t $DB_HOST psql -U $DB_USERNAME $DB_DATABASE -c 'DROP SCHEMA IF EXISTS public CASCADE;'
docker exec -t $DB_HOST psql -U $DB_USERNAME $DB_DATABASE -c 'CREATE SCHEMA public;'
cat $2 | docker exec -i $DB_HOST psql -U $DB_USERNAME $DB_DATABASE
