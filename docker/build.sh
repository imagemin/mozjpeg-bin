#!/bin/sh
set -e

curl -fLO "https://github.com/mozilla/mozjpeg/archive/v${mozjpeg_version}.tar.gz"
tar xf "v${mozjpeg_version}.tar.gz"

export CFLAGS='-pipe -flto -no-pie'
export LDFLAGS='-flto -no-pie -static -static-libgcc'

# This unsets CMAKE_SHARED_LIBRARY_LINK_C_FLAGS inside CMakeLists.txt,
# which is necessary to build a static binary. It can't be unset from the CLI because it
# is set as part of the compiler detection phase.
sed -E -i.bk '/^cmake_minimum_required/a\
unset(CMAKE_SHARED_LIBRARY_LINK_C_FLAGS)' "mozjpeg-$mozjpeg_version"/CMakeLists.txt

cmake -S "mozjpeg-$mozjpeg_version" -B build -G Ninja \
    -D ENABLE_SHARED=OFF \
    -D CMAKE_INSTALL_PREFIX=/usr/local \
    -D CMAKE_FIND_LIBRARY_SUFFIXES=.a \
    -D CMAKE_LINK_SEARCH_END_STATIC=1 -D CMAKE_LINK_SEARCH_START_STATIC=1

cd build && ninja
strip cjpeg-static
