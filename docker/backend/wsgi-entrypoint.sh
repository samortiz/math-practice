#!/bin/sh

until cd /app/backend/usacm
do
    echo "Waiting for server volume..."
done

until python ./manage.py migrate
do
    echo "Waiting for db to be ready..."
    sleep 2
done

python ./manage.py collectstatic --noinput

gunicorn wsgi -c /app/docker/backend/gunicorn_conf.py
