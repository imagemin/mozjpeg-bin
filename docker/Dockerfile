FROM docker.io/library/alpine:latest
RUN apk --update --no-cache upgrade
RUN apk add --no-cache \
    build-base \
    git \
    nasm \
    cmake \
    autoconf automake libtool \
    pkgconf \
    curl \
    libpng-dev libpng-static \
    zlib-dev zlib-static
RUN adduser -D builder
WORKDIR /home/builder
USER builder
# Exact time of MozJPEG v4.1.1 commit
ENV SOURCE_DATE_EPOCH 1660525997
COPY /build.sh build.sh
RUN ["/bin/sh", "build.sh"]
