FROM ubuntu:vivid

RUN apt-get -q update \
    && apt-get install --yes -q \
    mercurial \
    python-dev \
    python-pip \
    python-virtualenv \
    libffi-dev \
    libssl-dev \
    libyaml-dev \
    libmysqlclient-dev \
    clamav \
    clamav-freshclam \
    curl \
    wget \
    && apt-get clean

RUN freshclam --verbose
