FROM debian:12-slim

RUN apt-get update \
    && apt-get install cmake libtool nasm libpng-dev pkg-config build-essential wget \
    -yq --no-install-suggests --no-install-recommends --force-yes

WORKDIR /src
RUN wget --no-check-certificate https://github.com/mozilla/mozjpeg/archive/v4.1.3.tar.gz -O mozjpeg-4.1.3.tar.gz
RUN tar -xzvf mozjpeg-4.1.3.tar.gz
WORKDIR /src/mozjpeg-4.1.3

RUN  mkdir result && cd result && \
	cmake .. \
    && cmake --build .
