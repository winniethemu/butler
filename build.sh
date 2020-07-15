#!/usr/bin/env bash

# npm install

rm -rf dist
mkdir -p dist

if [[ $1 == "dev" || $1 == "prod" ]]; then
        npm run build:$1
        cp src/manifest.json dist/manifest.json
        cp src/popup.html dist/popup.html
        cp -R images dist/images
else
        echo "Error: invalid env variable. Expecting 'prod' or 'dev'."
fi
