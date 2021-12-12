#!/bin/bash

build() {
    echo 'Building extension'

    rm -rf ./dist/extension

    echo 'Building content-script'
    nx build content-script --skip-nx-cache
    echo 'Building popup'
    nx build popup --skip-nx-cache
    echo 'Building background'
    nx build background --skip-nx-cache


    echo 'Packaging everything up in ./dist/extension'
    mkdir -p ./dist/extension
    cp -r ./dist/apps/popup/* ./dist/extension
    cp ./dist/apps/content-script/bundle.js ./dist/extension/content-script.js
    cp ./dist/apps/background/main.js ./dist/extension/background.js
    cp ./manifest.json ./dist/extension
    cp -r ./fonts ./dist/extension
    cp -r ./extension-images ./dist/extension
    mv ./dist/extension/extension-images ./dist/extension/images
    mv ./dist/extension/index.html ./dist/extension/popup.html
    npm run extension:package
}

build
