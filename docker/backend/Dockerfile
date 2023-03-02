FROM python:3.8-bullseye

# Chrome headless is used to convert HTML to pdf
RUN apt-get update && apt-get install -y xfonts-base xfonts-75dpi
RUN apt-get update && curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    apt-get install -y ./google-chrome-stable_current_amd64.deb && \
    rm google-chrome-stable_current_amd64.deb

# Cron is run in the 'cron' container - it shares an image
RUN apt-get update && apt-get install -y \
  libpq-dev cron \
  && apt-get clean

# Setup for when this image is runnin in cron container
COPY ./docker/backend/crontab /etc/crontabs/root
RUN crontab /etc/crontabs/root

WORKDIR /app
ADD ./backend/requirements.txt /app/backend/

RUN pip install --upgrade pip
RUN pip install gunicorn
RUN pip install -r backend/requirements.txt
ENV DOCKER_RUNNING=True

ADD ./backend /app/backend
ADD ./docker /app/docker
