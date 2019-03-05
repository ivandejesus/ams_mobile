#!/bin/sh/env bash

cd /app
set -ex \
  && npm ci \
  && $(npm bin)/ng serve --watch --port 80 --host 0.0.0.0 --aot --disable-host-check

exec "$@"
