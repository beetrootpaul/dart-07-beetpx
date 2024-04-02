#!/usr/bin/env sh

# This line is very important, otherwise the hook doesn't prevent the commit or merge
#   in case of a failure.
set -e

set -x

npm run format
npm run tsc

git add --all .
