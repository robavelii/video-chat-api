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

docker exec -t $DB_HOST pg_dump -U $DB_USERNAME > $2
