#!/bin/sh

[ ! -d "./node_modules" ] && echo "Installing..." && npm install
rm -rf ./build
mkdir -p ./build

echo "Copying files..."
cp ./bot.json ./generate_secrets.sh ./build



