FROM debian:10-slim

RUN apt-get update \
    && apt-get install autoconf libtool nasm libpng-dev automake pkg-config build-essential wget \
    -yq --no-install-suggests --no-install-recommends --force-yes

WORKDIR /src
RUN wget --no-check-certificate https://github.com/mozilla/mozjpeg/archive/v3.3.1.tar.gz -O mozjpeg-3.3.1.tar.gz
RUN tar -xzvf mozjpeg-3.3.1.tar.gz
WORKDIR /src/mozjpeg-3.3.1

RUN autoreconf -fiv \
    && ./configure LDFLAGS=-static libpng_LIBS='/usr/lib/x86_64-linux-gnu/libpng16.a -lz' --enable-static --disable-shared \
    && make -j8
