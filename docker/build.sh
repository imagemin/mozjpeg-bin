#!/bin/sh
set -eu

mk_threads=$(($(nproc) - 1))
mozjpeg_ver="4.1.1"
make="make -j$mk_threads"

curl -fRLO "https://github.com/mozilla/mozjpeg/archive/refs/tags/v${mozjpeg_ver}.tar.gz"
tar -xzf "v${mozjpeg_ver}.tar.gz"
mv "mozjpeg-${mozjpeg_ver}" mozjpeg
cd mozjpeg

export CFLAGS='-flto -no-pie'
export LDFLAGS='-flto -no-pie -static -static-libgcc'

# This unsets CMAKE_SHARED_LIBRARY_LINK_C_FLAGS inside CMakeLists.txt because it won't
# work from the CLI.
sed -E -i.bk '/set\(LIBJPEG_TURBO_V/i\
set(CMAKE_SHARED_LIBRARY_LINK_C_FLAGS)' CMakeLists.txt

cmake -B build \
    -D ENABLE_SHARED=off \
    -D CMAKE_BUILD_TYPE=Release \
    -D CMAKE_FIND_LIBRARY_SUFFIXES=.a \
    -D CMAKE_LINK_SEARCH_END_STATIC=1 -D CMAKE_LINK_SEARCH_START_STATIC=1

cd build
$make cjpeg-static
strip cjpeg-static
