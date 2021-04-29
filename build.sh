#!/bin/sh

bold="$(tput bold)"
reset="$(tput sgr0)"

[ ! -d "./node_modules" ] && echo "${bold}Installing...${reset}" && yarn install
rm -rf ./build
mkdir -p ./build ./public

echo "${bold}Copying config files...${reset}"
cp ./bot.json ./generate_secrets.sh ./HELP.md ./package.json ./build

echo "${bold}Compiling TypeScript...${reset}"
./node_modules/.bin/tsc -b ./tsconfig.json


[ -f "./.env" ] && . ./.env

echo -e "\n${bold}Build done.${reset}"
